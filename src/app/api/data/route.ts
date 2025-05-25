import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'File parameter is required' },
        { status: 400 }
      );
    }

    // Security: Only allow specific CSV files from __src directory
    const allowedFiles = [
      'global_ceo.csv',
      '2025_global_data.csv',
      'Korn Ferry open ends Senior Leader Survey April 2025(Textual Data).csv'
    ];

    if (!allowedFiles.includes(fileName)) {
      return NextResponse.json(
        { error: 'File not found or not allowed' },
        { status: 404 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', '__src', fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Read the CSV file
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    // Return CSV content with appropriate headers
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error serving CSV data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also provide a list endpoint to see available files
export async function POST(request: NextRequest) {
  try {
    const srcPath = path.join(process.cwd(), 'data', '__src');
    
    if (!fs.existsSync(srcPath)) {
      return NextResponse.json(
        { error: '__src directory not found' },
        { status: 404 }
      );
    }

    const files = fs.readdirSync(srcPath)
      .filter(file => file.endsWith('.csv'))
      .map(file => ({
        name: file,
        size: fs.statSync(path.join(srcPath, file)).size,
        lastModified: fs.statSync(path.join(srcPath, file)).mtime
      }));

    return NextResponse.json({
      files,
      count: files.length,
      endpoint: '/api/data?file=<filename>'
    });

  } catch (error) {
    console.error('Error listing CSV files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
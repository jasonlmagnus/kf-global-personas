import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'data', '__src', 'Korn Ferry open ends Senior Leader Survey April 2025(Textual Data).csv');
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: 'CSV file not found' },
        { status: 404 }
      );
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to read CSV file' },
      { status: 500 }
    );
  }
} 
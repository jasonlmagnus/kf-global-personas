import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import { promises as fs } from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get the base URL for API calls
function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL 
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'http://localhost:3000';
  }
  return '';
}

// Function to fetch working persona data via API
async function getAllPersonas() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/personas`);
    if (!response.ok) {
      console.error('Failed to fetch personas:', response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching personas:', error);
    return [];
  }
}

// Function to read and process CSV files
async function readCSVFile(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'data', '__src', filename);
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return '';
  }
}

// Function to parse CSV and search for specific roles/topics
function searchSeniorLeaderData(csvContent: string, searchTerms: string[]): string {
  if (!csvContent) return '';
  
  const lines = csvContent.split('\n');
  const header = lines[0];
  const dataRows = lines.slice(1);
  
  // Find relevant rows containing search terms
  const relevantRows = dataRows.filter(row => {
    const lowerRow = row.toLowerCase();
    return searchTerms.some(term => lowerRow.includes(term.toLowerCase()));
  });
  
  if (relevantRows.length === 0) return '';
  
  // Take first 15 relevant rows to avoid token limits
  const limitedRows = relevantRows.slice(0, 15);
  
  return `\n## Relevant Survey Responses for: ${searchTerms.join(', ')}\n\nHeader: ${header}\n\nMatching Responses:\n${limitedRows.join('\n')}\n\nTotal matching responses: ${relevantRows.length}\n`;
}

// Function to extract key insights based on message context
function getRelevantSurveyData(csvContent: string, userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Define search patterns for different queries
  const searchPatterns = [
    {
      keywords: ['cfo', 'chief financial officer', 'financial officer'],
      terms: ['Chief Financial Officer']
    },
    {
      keywords: ['ceo', 'chief executive officer'],
      terms: ['Chief Executive Officer']
    },
    {
      keywords: ['chro', 'chief human resource', 'hr officer'],
      terms: ['Chief Human Resource Officer']
    },
    {
      keywords: ['cto', 'chief technology officer', 'technology officer'],
      terms: ['Chief Technology Officer']
    },
    {
      keywords: ['cmo', 'chief marketing officer', 'marketing officer'],
      terms: ['Chief Marketing Officer']
    },
    {
      keywords: ['coo', 'chief operations officer', 'operations officer'],
      terms: ['Chief Operations Officer']
    },
    {
      keywords: ['strategy', 'strategic priorities', 'strategic planning'],
      terms: ['strategic', 'strategy', 'planning']
    },
    {
      keywords: ['consulting', 'consultant', 'consulting firm'],
      terms: ['consulting', 'consultant']
    },
    {
      keywords: ['decision', 'decision-making', 'decisions'],
      terms: ['decision', 'primary decision maker']
    }
  ];
  
  // Find matching pattern
  const matchingPattern = searchPatterns.find(pattern => 
    pattern.keywords.some(keyword => message.includes(keyword))
  );
  
  if (matchingPattern) {
    return searchSeniorLeaderData(csvContent, matchingPattern.terms);
  }
  
  return '';
}

// Function to format CSV data for AI consumption
function formatCSVForAI(csvContent: string, title: string): string {
  if (!csvContent) return '';
  
  const lines = csvContent.split('\n');
  const header = lines[0];
  const sampleRows = lines.slice(1, 11); // Reduced to 10 sample rows to save tokens
  
  return `\n## ${title}\n\nHeader: ${header}\n\nSample Data (first 10 rows):\n${sampleRows.join('\n')}\n\nTotal rows: ${lines.length - 1}\n`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const userMessage = messages[messages.length - 1]?.content || '';
    console.log('Chat API: Processing request for message:', userMessage.substring(0, 100));

    // Get persona data
    console.log('Chat API: Fetching personas...');
    const personas = await getAllPersonas();
    console.log('Chat API: Loaded', personas.length, 'personas');
    
    // Read CSV data files
    console.log('Chat API: Reading CSV files...');
    const globalData = await readCSVFile('2025_global_data.csv');
    console.log('Chat API: Global data length:', globalData.length);
    
    const seniorLeaderData = await readCSVFile('Korn Ferry open ends Senior Leader Survey April 2025(Textual Data).csv');
    console.log('Chat API: Senior leader data length:', seniorLeaderData.length);
    
    // Get relevant survey data based on user query
    console.log('Chat API: Processing survey data...');
    const relevantSurveyData = getRelevantSurveyData(seniorLeaderData, userMessage);
    console.log('Chat API: Relevant survey data length:', relevantSurveyData.length);
    
    // Format CSV data for the system prompt
    const csvDataSummary = [
      formatCSVForAI(globalData, "2025 Global Survey Data"),
      relevantSurveyData || formatCSVForAI(seniorLeaderData, "Senior Leader Survey Textual Responses")
    ].join('\n');

    console.log('Chat API: Creating system prompt...');
    // Create dynamic system prompt with persona data and CSV data - minimal version for gpt-4o-mini
    const systemPrompt = `You are an AI assistant for KF Personas providing insights based on Korn Ferry research and survey data.

## Available Personas (${personas.length} total)
${personas.slice(0, 6).map(persona => `- ${persona.title}`).join('\n')}

## Survey Data Available
- Global Survey: ${globalData.split('\n').length - 1} responses
- Senior Leader Survey: ${seniorLeaderData.split('\n').length - 1} executive responses
${relevantSurveyData ? '\n### Key Survey Insights:\n' + relevantSurveyData.substring(0, 800) + '...' : ''}

Provide data-driven insights about professional personas using the research and survey data.`;

    console.log('Chat API: System prompt length:', systemPrompt.length);
    console.log('Chat API: Calling OpenAI with gpt-4o-mini...');

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
    });

    console.log('Chat API: OpenAI call successful, setting up stream...');

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAllPersonas } from '@/lib/personaAdapter';
import { isGlobalPersona, isCountryPersona, isGlobalPersonaV3 } from '@/types/personas';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to get persona context for the AI
async function getPersonaContext() {
  try {
    // Get all personas to provide comprehensive context
    const allPersonas = await getAllPersonas();
    
    // Format persona data for the AI context
    const personasSummary = allPersonas.map(persona => {
      const basicInfo = `${persona.title} (${persona.region.toUpperCase()})`;
      
      if (isGlobalPersonaV3(persona)) {
        // Handle v3 global persona structure
        return `
${basicInfo}:
- Role: ${persona.coreUnderstanding.core.role || 'Not specified'}
- Goal: ${persona.coreUnderstanding.core.userGoalStatement || 'Not specified'}
- Core Belief: ${persona.coreUnderstanding.core.coreBelief || 'Not specified'}
- Key Motivations: ${persona.strategicValuePoints.motivations.items?.slice(0, 3).join('; ') || 'Not specified'}
- Main Challenges: ${persona.painPointsAndChallenges.frustrations.items?.slice(0, 3).join('; ') || 'Not specified'}
- Collaboration Style: ${persona.engagementApproach.collaborationInsights.items?.slice(0, 2).join('; ') || 'Not specified'}`;
      } else if (isGlobalPersona(persona)) {
        // Handle v1 global persona structure
        return `
${basicInfo}:
- Goal: ${persona.goalStatement || 'Not specified'}
- Core Belief: ${persona.coreBelief || 'Not specified'}
- Key Motivations: ${persona.motivations?.slice(0, 3).join('; ') || 'Not specified'}
- Main Pain Points: ${persona.painPoints?.slice(0, 3).join('; ') || 'Not specified'}
- Collaboration Style: ${persona.collaborationInsights?.slice(0, 2).join('; ') || 'Not specified'}`;
      } else if (isCountryPersona(persona)) {
        // Handle country persona structure
        const motivationsArray = Object.values(persona.motivations || {}).flat();
        const painPointsArray = Object.values(persona.painPoints || {}).flat();
        
        return `
${basicInfo}:
- Goal: ${persona.userGoalStatement || 'Not specified'}
- Quote: ${persona.quote || 'Not specified'}
- Key Motivations: ${motivationsArray.slice(0, 3).join('; ') || 'Not specified'}
- Main Challenges: ${painPointsArray.slice(0, 3).join('; ') || 'Not specified'}
- Cultural Context: ${persona.culturalContext || 'Not specified'}`;
      }
      
      return `${basicInfo}: Data structure not recognized`;
    }).join('\n');

    return personasSummary;
  } catch (error) {
    console.error('Error loading persona context:', error);
    return 'Persona data temporarily unavailable.';
  }
}

// Enhanced system prompt with persona context
async function buildSystemPrompt() {
  const personaContext = await getPersonaContext();
  
  return `You are an AI assistant for the Korn Ferry Global Personas application. You have access to detailed persona data for different regions (Australia, UK, UAE, Global) and departments (CEO, CHRO, Sales, Talent, Leadership Development, Rewards).

AVAILABLE PERSONA DATA:
${personaContext}

CAPABILITIES:
- Provide specific insights about persona characteristics, goals, and behaviors
- Compare personas across regions and departments
- Explain communication strategies for specific personas
- Analyze persona motivations, pain points, and collaboration styles
- Help with persona-based decision making and strategy

GUIDELINES:
- Always reference specific persona data when answering questions
- If asked about a specific persona (e.g., "Australian CEO"), provide detailed information from the actual data
- Compare and contrast personas when relevant
- If unsure about specific data points, acknowledge this and suggest how to find more information
- Be professional, insightful, and actionable in your responses

When users ask about communication strategies or "how to speak to" a persona, provide specific guidance based on their actual goals, motivations, pain points, and collaboration insights from the data.`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Build system prompt with current persona context
    const systemPrompt = await buildSystemPrompt();

    // Create the chat completion with streaming
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const data = encoder.encode(`data: ${JSON.stringify({ content })}\n\n`);
              controller.enqueue(data);
            }
          }
          // Send final message to indicate completion
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
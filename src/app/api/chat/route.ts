import { NextRequest } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Vector store ID from environment variables
const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const userMessage = messages[messages.length - 1]?.content || '';
    console.log('Chat API: Processing request for message:', userMessage.substring(0, 100));

    // Check if vector store ID is configured
    if (!VECTOR_STORE_ID) {
      console.error('OPENAI_VECTOR_STORE_ID not configured in environment variables');
      return new Response(
        JSON.stringify({ 
          error: "Vector store not configured", 
          details: "OPENAI_VECTOR_STORE_ID environment variable is missing" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create a thread for this conversation
    console.log('Chat API: Creating thread...');
    const thread = await openai.beta.threads.create();
    
    // Add the user message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    // Create an assistant with access to the vector store
    console.log('Chat API: Creating assistant with vector store...');
    const assistant = await openai.beta.assistants.create({
      name: "KF Personas Assistant",
      instructions: `You are an AI assistant specialized in Korn Ferry persona insights with access to detailed research data from the vector store.

# INSTRUCTIONS
1. **Use ONLY the specific persona data from the vector store** - do not use general business knowledge
2. **Reference exact quotes** from Goal Statements, Motivations, and Pain Points when available
3. **Be specific to the personas mentioned** in the user's question
4. **When comparing personas** (like UK CEO vs Global CEO), highlight the actual differences from their profiles
5. **Include direct quotes** from the persona data to support your answers
6. **Identify the source** by mentioning the specific persona (e.g., "According to the UAE CEO persona...")

When answering questions:
- Search the vector store for relevant persona information
- Provide specific, data-backed insights
- Quote directly from the persona profiles when possible
- If comparing multiple personas, clearly distinguish between them
- Focus on actionable insights for content marketing and business strategy

Answer the user's question using the specific persona data from the vector store.`,
      model: "gpt-4o-mini",
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [VECTOR_STORE_ID]
        }
      }
    });

    // Run the assistant with streaming
    console.log('Chat API: Running assistant with streaming...');
    const stream = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistant.id,
    });

    // Stream the response
    console.log('Chat API: Setting up response stream...');
    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.event === 'thread.message.delta') {
              const delta = event.data.delta;
              if (delta.content && delta.content[0] && delta.content[0].type === 'text') {
                const textDelta = delta.content[0].text?.value || '';
                if (textDelta) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: textDelta })}\n\n`));
                }
              }
            } else if (event.event === 'thread.run.completed') {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
              
              // Clean up
              try {
                await openai.beta.assistants.delete(assistant.id);
              } catch (cleanupError) {
                console.warn('Failed to cleanup assistant:', cleanupError);
              }
              return;
            } else if (event.event === 'thread.run.failed') {
              console.error('Run failed:', event.data);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "I apologize, but there was an error processing your request." })}\n\n`));
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
              return;
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "I apologize, but there was an error processing your request." })}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
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
      JSON.stringify({ 
        error: "Failed to process request", 
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { generatePersonaPrompt } from "@/lib/persona-generation/prompts";

// The client will be instantiated on each request to ensure the API key is handled correctly.
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new NextResponse(
      JSON.stringify({
        error:
          "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Instantiate the client inside the try block to catch initialization errors.
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    const { type, content, region, department, brand } = body;

    // --- Authorization Check ---
    if (!brand) {
      return NextResponse.json({ error: 'Brand is a required field.' }, { status: 400 });
    }

    if (session.user.role === 'BRAND_USER' && session.user.brand !== brand) {
      return NextResponse.json({ error: 'Forbidden. You can only generate personas for your own brand.' }, { status: 403 });
    }
    // Super admins can generate for any brand, so no explicit check is needed here for them.
    // --- End Authorization Check ---

    if (!type || !content || !region || !department) {
      return new NextResponse(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = generatePersonaPrompt(content, type, region, department);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const jsonContent = completion.choices[0].message.content;

    if (!jsonContent) {
      throw new Error("AI returned an empty response.");
    }

    // The AI is instructed to return valid JSON, but we parse it to be sure.
    const personaData = JSON.parse(jsonContent);

    return new NextResponse(JSON.stringify(personaData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating persona:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate persona.", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 
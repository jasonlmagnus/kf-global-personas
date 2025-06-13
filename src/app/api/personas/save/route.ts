import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Persona } from "@/types/personas";

export async function POST(req: NextRequest) {
  try {
    const persona: Persona = await req.json();

    if (!persona || !persona.region || !persona.department) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid persona data. 'region' and 'department' are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize region and department to prevent path traversal attacks
    const sanitizedRegion = path.normalize(persona.region).replace(/^(\.\.[\/\\])+/, '');
    const sanitizedDepartment = path.normalize(persona.department).replace(/^(\.\.[\/\\])+/, '');

    if (sanitizedRegion.includes('/') || sanitizedRegion.includes('\\') || sanitizedDepartment.includes('/') || sanitizedDepartment.includes('\\')) {
        return new NextResponse(
            JSON.stringify({ error: "Invalid characters in region or department." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const filename = `${sanitizedRegion}_${sanitizedDepartment}.json`;
    const filePath = path.join(process.cwd(), "public", "data", filename);

    const fileContent = JSON.stringify(persona, null, 2);

    await fs.writeFile(filePath, fileContent, "utf8");

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Persona saved successfully to ${filename}`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving persona:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ error: "Failed to save persona.", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 
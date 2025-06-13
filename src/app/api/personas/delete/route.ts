import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { region, department, brand } = await req.json();

    // --- Authorization Check ---
    if (!brand) {
        return NextResponse.json({ error: 'Brand is a required field for deleting a persona.' }, { status: 400 });
    }

    if (session.user.role === 'BRAND_USER' && session.user.brand !== brand) {
      return NextResponse.json({ error: 'Forbidden. You can only delete personas from your own brand.' }, { status: 403 });
    }
    // --- End Authorization Check ---

    if (!region || !department) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid request body. 'region' and 'department' are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize to prevent path traversal
    const sanitizedRegion = path.normalize(region).replace(/^(\.\.[\/\\])+/, '');
    const sanitizedDepartment = path.normalize(department).replace(/^(\.\.[\/\\])+/, '');

    if (sanitizedRegion.includes('/') || sanitizedRegion.includes('\\') || sanitizedDepartment.includes('/') || sanitizedDepartment.includes('\\')) {
        return new NextResponse(
            JSON.stringify({ error: "Invalid characters in region or department." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const filename = `${sanitizedRegion}_${sanitizedDepartment}.json`;
    const filePath = path.join(process.cwd(), "public", "brands", brand, "data", filename);

    try {
      await fs.unlink(filePath);
    } catch (e) {
        // Specifically handle case where file doesn't exist
        if (e.code === 'ENOENT') {
            return new NextResponse(
                JSON.stringify({ error: "Persona not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }
        // Re-throw other errors
        throw e;
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Persona ${filename} deleted successfully.`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting persona:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete persona.", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 
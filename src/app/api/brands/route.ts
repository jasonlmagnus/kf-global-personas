import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Note: The session check is removed from this API route.
// Security is handled by the page-level middleware (`middleware.ts`),
// which ensures only SUPER_ADMIN users can access the page that calls this API.

export async function GET(req: NextRequest) {
    try {
        const brandsDirectory = path.join(process.cwd(), 'public', 'brands');
        const entries = await fs.readdir(brandsDirectory, { withFileTypes: true });
        const directories = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        return NextResponse.json(directories);
    } catch (error) {
        console.error("Error listing brands:", error);
        return NextResponse.json({ error: "Failed to list brands." }, { status: 500 });
    }
} 
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { BrandConfig } from "@/contexts/ThemeContext";

const BRANDS_ROOT_DIR = path.join(process.cwd(), "public", "brands");

// This function creates a full BrandConfig object from our simplified one.
const createFullConfig = (
  simpleConfig: Partial<{ logoPath: string; fontFamily: string; colors: { primary: string; text: string; } }>
): BrandConfig => {
  const fontName = simpleConfig.fontFamily || "Inter";
  return {
    brandName: "Korn Ferry Personas",
    logoUrl: simpleConfig.logoPath || "/kf-logo-white.svg",
    faviconUrl: "/favicon.ico", // Default favicon
    colors: {
      primary: simpleConfig.colors?.primary || "#3b82f6",
      secondary: "#6b7280", // Default
      accent: simpleConfig.colors?.primary || "#3b82f6", // Use primary as accent
      text: simpleConfig.colors?.text || "#1f2937",
      textLight: "#f9fafb", // Default
      background: "#ffffff", // Default
      headerText: "#ffffff", // Default
    },
    typography: {
      fontFamily: `${fontName}, sans-serif`,
      googleFontUrl: `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;700&display=swap`,
    },
    navigation: [
      { name: "Personas", path: "/personas" },
      { name: "Data", path: "#" },
      { name: "Content", path: "#" },
      { name: "Upload", path: "/admin/upload" },
      { name: "Brand Setup", path: "/admin/brand-setup" },
    ],
    footer: {
      copyrightName: "Korn Ferry",
      links: [],
    },
    chatbot: { // Default chatbot styles
      headerColor: simpleConfig.colors?.primary || "#3b82f6",
      assistantName: "Persona Assistant",
      assistantSubtitle: "Online",
      welcomeMessage: "How can I help you today?",
      userBubbleColor: "#d1d5db",
      assistantBubbleColor: simpleConfig.colors?.primary || "#3b82f6",
    }
  };
};

const default_full_config = createFullConfig({});

async function getBrandConfigPath(brandName: string | null): Promise<string | null> {
    if (!brandName) return null;

    // Basic sanitization
    const sanitizedBrandName = path.normalize(brandName).replace(/^(\.\.[\/\\])+/, '');
    if (sanitizedBrandName.includes('/') || sanitizedBrandName.includes('\\')) {
        return null;
    }
    
    return path.join(process.cwd(), 'public', 'brands', sanitizedBrandName, 'brand.config.json');
}

// GET handler to list available brands or fetch a specific brand's config
export async function GET(request: NextRequest) {
    const brandName = request.nextUrl.searchParams.get('name');
    const configPath = await getBrandConfigPath(brandName);

    if (!configPath) {
        return NextResponse.json({ error: 'A valid brand name must be provided.' }, { status: 400 });
    }

    try {
        const fileContent = await fs.readFile(configPath, 'utf8');
        const config = JSON.parse(fileContent);
        return NextResponse.json(config);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return NextResponse.json({ error: `Brand configuration for '${brandName}' not found.` }, { status: 404 });
        }
        console.error(`Error reading brand config for ${brandName}:`, error);
        return NextResponse.json({ error: 'Failed to read brand configuration.' }, { status: 500 });
    }
}

// POST handler to save a new brand configuration
export async function POST(request: NextRequest) {
    const brandName = request.nextUrl.searchParams.get('name');
    if (!brandName) {
        return NextResponse.json({ error: 'Brand name query parameter is required.' }, { status: 400 });
    }

    const configPath = await getBrandConfigPath(brandName);
    if (!configPath) {
        return NextResponse.json({ error: 'Invalid brand name provided.' }, { status: 400 });
    }

    const brandDir = path.dirname(configPath);
    const dataDir = path.join(brandDir, 'data');
    
    try {
        const formData = await request.formData();
        const settingsStr = formData.get('settings') as string | null;
        const logoFile = formData.get('logo') as File | null;

        if (!settingsStr) {
            return NextResponse.json({ error: "Missing 'settings' data." }, { status: 400 });
        }

        const settings: BrandConfig = JSON.parse(settingsStr);
        let finalConfig = { ...settings };

        // Ensure directories exist
        await fs.mkdir(brandDir, { recursive: true });
        await fs.mkdir(dataDir, { recursive: true });

        if (logoFile) {
            const logoFilename = `logo${path.extname(logoFile.name)}`;
            const logoPath = path.join(brandDir, logoFilename);
            const buffer = Buffer.from(await logoFile.arrayBuffer());
            await fs.writeFile(logoPath, buffer);
            
            // Update the logoUrl in the config to point to the new file path
            finalConfig.logoUrl = `/brands/${brandName}/${logoFilename}?v=${new Date().getTime()}`;
        }
        
        await fs.writeFile(configPath, JSON.stringify(finalConfig, null, 2), 'utf8');
        return NextResponse.json({ success: true, message: `Brand '${brandName}' saved successfully.`, config: finalConfig });

    } catch (error) {
        console.error(`Error writing brand config for ${brandName}:`, error);
        return NextResponse.json({ error: 'Failed to write brand configuration.' }, { status: 500 });
    }
} 
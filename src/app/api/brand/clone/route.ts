import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const BRANDS_ROOT = path.join(process.cwd(), "public", "brands");

function sanitize(name: string): string | null {
  const normalized = path.normalize(name).replace(/^(\.\.[\/\\])+/,'');
  if (normalized.includes('/') || normalized.includes('\\')) return null;
  return normalized;
}

export async function POST(request: NextRequest) {
  try {
    const { source, newName } = await request.json();
    if (!source || !newName) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const sourceSlug = sanitize(source);
    const targetSlug = sanitize(newName.trim().toLowerCase().replace(/\s+/g, '-'));
    if (!sourceSlug || !targetSlug) {
      return NextResponse.json({ error: 'Invalid brand name provided.' }, { status: 400 });
    }

    const sourceDir = path.join(BRANDS_ROOT, sourceSlug);
    const targetDir = path.join(BRANDS_ROOT, targetSlug);

    await fs.access(sourceDir).catch(() => { throw new Error('SOURCE_NOT_FOUND'); });
    const targetExists = await fs.access(targetDir).then(() => true).catch(() => false);
    if (targetExists) {
      return NextResponse.json({ error: 'Target brand already exists.' }, { status: 409 });
    }

    await fs.cp(sourceDir, targetDir, { recursive: true });

    const configPath = path.join(targetDir, 'brand.config.json');
    try {
      const data = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(data);
      config.brandName = newName.trim();
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
    } catch { /* ignore if config missing */ }

    return NextResponse.json({ success: true, brand: targetSlug });
  } catch (err: any) {
    if (err.message === 'SOURCE_NOT_FOUND') {
      return NextResponse.json({ error: 'Source brand not found.' }, { status: 404 });
    }
    console.error('Error cloning brand:', err);
    return NextResponse.json({ error: 'Failed to clone brand.' }, { status: 500 });
  }
}

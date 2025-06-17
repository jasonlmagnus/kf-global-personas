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
    const { oldName, newName } = await request.json();
    if (!oldName || !newName) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const oldSlug = sanitize(oldName);
    const newSlug = sanitize(newName.trim().toLowerCase().replace(/\s+/g, '-'));
    if (!oldSlug || !newSlug) {
      return NextResponse.json({ error: 'Invalid brand name provided.' }, { status: 400 });
    }

    const oldDir = path.join(BRANDS_ROOT, oldSlug);
    const newDir = path.join(BRANDS_ROOT, newSlug);

    await fs.access(oldDir).catch(() => { throw new Error('OLD_NOT_FOUND'); });
    const exists = await fs.access(newDir).then(() => true).catch(() => false);
    if (exists) {
      return NextResponse.json({ error: 'Target brand already exists.' }, { status: 409 });
    }

    await fs.rename(oldDir, newDir);
    const configPath = path.join(newDir, 'brand.config.json');
    try {
      const data = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(data);
      config.brandName = newName.trim();
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
    } catch { /* ignore if config missing */ }

    return NextResponse.json({ success: true, brand: newSlug });
  } catch (err: any) {
    if (err.message === 'OLD_NOT_FOUND') {
      return NextResponse.json({ error: 'Brand not found.' }, { status: 404 });
    }
    console.error('Error renaming brand:', err);
    return NextResponse.json({ error: 'Failed to rename brand.' }, { status: 500 });
  }
}

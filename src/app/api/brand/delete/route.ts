import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const BRANDS_ROOT = path.join(process.cwd(), "public", "brands");
const BACKUP_ROOT = path.join(process.cwd(), "backups", "brands");

function sanitize(name: string): string | null {
  const normalized = path.normalize(name).replace(/^(\.\.[\/\\])+/,'');
  if (normalized.includes('/') || normalized.includes('\\')) return null;
  return normalized;
}

export async function DELETE(request: NextRequest) {
  const brandName = request.nextUrl.searchParams.get('name');
  if (!brandName) {
    return NextResponse.json({ error: 'Brand name query parameter is required.' }, { status: 400 });
  }

  const slug = sanitize(brandName);
  if (!slug) {
    return NextResponse.json({ error: 'Invalid brand name provided.' }, { status: 400 });
  }

  const brandDir = path.join(BRANDS_ROOT, slug);
  try {
    await fs.access(brandDir);
  } catch {
    return NextResponse.json({ error: `Brand '${slug}' not found.` }, { status: 404 });
  }

  await fs.mkdir(BACKUP_ROOT, { recursive: true });
  const backupDir = path.join(BACKUP_ROOT, `${slug}_${Date.now()}`);
  await fs.rename(brandDir, backupDir);

  return NextResponse.json({ success: true, backup: path.relative(process.cwd(), backupDir) });
}

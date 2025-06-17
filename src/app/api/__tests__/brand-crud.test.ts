/* @jest-environment node */
import fs from 'fs/promises';
import path from 'path';
import { NextRequest } from 'next/server';
import { DELETE as deleteBrand } from '../brand/delete/route';
import { POST as cloneBrand } from '../brand/clone/route';
import { POST as renameBrand } from '../brand/rename/route';

describe('Brand CRUD API', () => {
  const brandsRoot = path.join(process.cwd(), 'public', 'brands');
  const backupsRoot = path.join(process.cwd(), 'backups', 'brands');

  const setupBrand = async (slug: string) => {
    const dir = path.join(brandsRoot, slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'brand.config.json'), JSON.stringify({ brandName: slug }, null, 2));
  };

  const cleanDir = async (p: string) => {
    await fs.rm(p, { recursive: true, force: true });
  };

  afterEach(async () => {
    await cleanDir(path.join(brandsRoot, 'test-brand'));
    await cleanDir(path.join(brandsRoot, 'cloned-brand'));
    await cleanDir(path.join(brandsRoot, 'renamed-brand'));
    // remove backups
    await fs.readdir(backupsRoot).then(files => Promise.all(files.map(f => cleanDir(path.join(backupsRoot, f))))).catch(() => {});
  });

  it('clones a brand directory', async () => {
    await setupBrand('test-brand');
    const req = new NextRequest(new Request('http://localhost/api/brand/clone', { method: 'POST', body: JSON.stringify({ source: 'test-brand', newName: 'Cloned Brand' }) }));
    const res = await cloneBrand(req);
    expect(res.status).toBe(200);
    const targetDir = path.join(brandsRoot, 'cloned-brand');
    const stat = await fs.stat(targetDir);
    expect(stat.isDirectory()).toBe(true);
  });

  it('renames a brand directory', async () => {
    await setupBrand('test-brand');
    const req = new NextRequest(new Request('http://localhost/api/brand/rename', { method: 'POST', body: JSON.stringify({ oldName: 'test-brand', newName: 'Renamed Brand' }) }));
    const res = await renameBrand(req);
    expect(res.status).toBe(200);
    await expect(fs.access(path.join(brandsRoot, 'test-brand'))).rejects.toBeDefined();
    const stat = await fs.stat(path.join(brandsRoot, 'renamed-brand'));
    expect(stat.isDirectory()).toBe(true);
  });

  it('soft deletes a brand directory', async () => {
    await setupBrand('test-brand');
    const req = new NextRequest(new Request('http://localhost/api/brand/delete?name=test-brand', { method: 'DELETE' }));
    const res = await deleteBrand(req);
    expect(res.status).toBe(200);
    await expect(fs.access(path.join(brandsRoot, 'test-brand'))).rejects.toBeDefined();
    const backups = await fs.readdir(backupsRoot);
    expect(backups.some(name => name.startsWith('test-brand_'))).toBe(true);
  });
});

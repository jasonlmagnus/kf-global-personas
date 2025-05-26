import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper for display names (can be expanded)
const getDisplayName = (id: string): string => {
  const nameMap: Record<string, string> = {
    ceo: 'CEO',
    chro: 'CHRO',
    global: 'Global',
    uk: 'UK',
    uae: 'UAE',
    aus: 'Australia',
    leadership_dev: 'Leadership Development',
    sales: 'Sales',
    talent: 'Talent Acquisition',
    rewards: 'Rewards'
    // Add more specific mappings as needed
  };
  if (nameMap[id]) {
    return nameMap[id];
  }
  // Simple title case for others
  return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const regionDirs = fs.readdirSync(dataDir).filter(item => {
      if (item.startsWith('.') || item === 'archive' || item === '__src') return false;
      try {
        return fs.statSync(path.join(dataDir, item)).isDirectory();
      } catch (e) {
        // Ignore errors from trying to stat files that might have been deleted during scan
        return false;
      }
    });

    const regions = regionDirs.map(id => ({ id, name: getDisplayName(id) })).sort((a,b) => {
      if (a.id === 'global') return -1; // Ensure Global is first
      if (b.id === 'global') return 1;
      return a.name.localeCompare(b.name);
    });

    const allDepartments = new Set<string>();
    regionDirs.forEach(regionId => {
      const regionPath = path.join(dataDir, regionId);
      try {
        const deptDirs = fs.readdirSync(regionPath).filter(item => {
          if (item.startsWith('.')) return false;
          try {
            return fs.statSync(path.join(regionPath, item)).isDirectory();
          } catch (e) {
            return false;
          }
        });
        deptDirs.forEach(deptId => allDepartments.add(deptId));
      } catch (e) {
         // If a region directory can't be read, skip it
        console.warn(`Could not read departments for region ${regionId}:`, e);
      }
    });

    const departments = Array.from(allDepartments)
      .map(id => ({ id, name: getDisplayName(id) }))
      .sort((a,b) => a.name.localeCompare(b.name));

    return NextResponse.json({ regions, departments });
  } catch (error) {
    console.error('Error fetching API config:', error);
    return NextResponse.json({ error: 'Internal server error fetching config' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Persona, GlobalPersona, CountryPersona, Region, Department } from '@/types/personas';

// Define interfaces for the JSON data structure
interface PersonaJsonData {
  'Profession/Role'?: string;
  'User Goal Statement'?: string;
  'User Quote'?: string;
  'Needs'?: string[] | Record<string, string[]>;
  'Motivations'?: string[] | Record<string, string[]>;
  'Frustrations / Pain Points'?: string[] | Record<string, string[]>;
  'Emotional Triggers'?: {
    Positive?: string[];
    Negative?: string[];
  } | Array<Record<string, string>>;
  'Regional Nuances'?: string[] | Record<string, string>;
  'Cultural Context'?: string;
  'Behaviors'?: string[] | Record<string, string[]>;
  'Key Responsibilities'?: string[] | Record<string, string[]>;
  'Collaboration Insights'?: string[] | Record<string, string[]>;
  'Presentation Guidance'?: Record<string, unknown>;
  'Comparison to Generic CEO'?: string[];
  [key: string]: unknown; // Allow other properties
}

// Server-side function to read JSON files
function readJsonFile(filePath: string): PersonaJsonData | null {
  try {
    // First check if the file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File does not exist: ${filePath}`);
      return null;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    return null;
  }
}

// Convert raw data into a normalized Persona
function normalizePersonaData(data: PersonaJsonData, region: Region, department: Department): Persona {
  if (region === 'global') {
    // Handle GlobalPersona
    const persona: GlobalPersona = {
      id: `${region}-${department}`,
      title: typeof data['Role'] === 'string' ? data['Role'] :
             (typeof data['Profession/Role'] === 'string' ? data['Profession/Role'] :
             `${department.replace('_', ' ').toUpperCase()}`),
      department,
      region,
      isGlobal: true,
      goalStatement: typeof data['Goal Statement'] === 'string' ? data['Goal Statement'] :
                     (typeof data['User Goal Statement'] === 'string' ? data['User Goal Statement'] : ''),
      quote: typeof data['Quote'] === 'string' ? data['Quote'] :
             (typeof data['User Quote'] === 'string' ? data['User Quote'] : undefined),
      needs: Array.isArray(data['Needs']) ? data['Needs'] as string[] : (typeof data['Needs'] === 'object' ? Object.values(data['Needs'] as Record<string, string[]>).flat() : []),
      motivations: Array.isArray(data['Motivations']) ? data['Motivations'] as string[] : (typeof data['Motivations'] === 'object' ? Object.values(data['Motivations'] as Record<string, string[]>).flat() : []),
      keyResponsibilities: Array.isArray(data['Key Responsibilities']) ? data['Key Responsibilities'] as string[] : (typeof data['Key Responsibilities'] === 'object' ? Object.values(data['Key Responsibilities'] as Record<string, string[]>).flat() : []),
      
      knowledgeOrExpertise: data['Knowledge_Areas'] as any || undefined,
      typicalChallenges: data['Typical_Challenges'] as any || undefined,
      currentProjects: data['Current_Projects'] as any || undefined,

      painPoints: Array.isArray(data['Frustrations / Pain Points']) ? data['Frustrations / Pain Points'] as string[] : (typeof data['Frustrations / Pain Points'] === 'object' ? Object.values(data['Frustrations / Pain Points'] as Record<string, string[]>).flat() : undefined),
      behaviors: Array.isArray(data['Behaviors']) ? data['Behaviors'] as string[] : (typeof data['Behaviors'] === 'object' ? Object.values(data['Behaviors'] as Record<string, string[]>).flat() : undefined),
      collaborationInsights: Array.isArray(data['Collaboration Insights']) ? data['Collaboration Insights'] as string[] : (typeof data['Collaboration Insights'] === 'object' ? Object.values(data['Collaboration Insights'] as Record<string, string[]>).flat() : undefined),
    };
    return persona;
  } else {
    // Handle CountryPersona (existing logic, but ensure return type is CountryPersona)
    const persona: CountryPersona = {
      id: `${region}-${department}`,
      title: data['Profession/Role'] || `${region.toUpperCase()} ${department.replace('_', ' ').toUpperCase()}`,
      department,
      region,
      isGlobal: false,
      userGoalStatement: data['User Goal Statement'] || '',
      quote: data['User Quote'] || undefined,
      needs: [],
      motivations: [],
      painPoints: [],
      emotionalTriggers: {
        positive: [],
        negative: []
      },
      regionalNuances: [],
      culturalContext: data['Cultural Context'] || '',
      behaviors: [],
      keyResponsibilities: [],
      collaborationInsights: [],
      presentation: data['Presentation Guidance'] || {},
      comparison: data['Comparison to Generic CEO'] || []
    };
    
    // Extract nested objects - Needs
    if (data['Needs']) {
      if (Array.isArray(data['Needs'])) {
        persona.needs = data['Needs'];
      } else if (typeof data['Needs'] === 'object') {
        const needsValues = Object.values(data['Needs'] as Record<string, string[]>);
        persona.needs = needsValues.flat();
      }
    }
    
    // Extract nested objects - Motivations
    if (data['Motivations']) {
      if (Array.isArray(data['Motivations'])) {
        persona.motivations = data['Motivations'];
      } else if (typeof data['Motivations'] === 'object') {
        const motivationValues = Object.values(data['Motivations'] as Record<string, string[]>);
        persona.motivations = motivationValues.flat();
      }
    }
    
    // Extract nested objects - Pain Points
    if (data['Frustrations / Pain Points']) {
      if (Array.isArray(data['Frustrations / Pain Points'])) {
        persona.painPoints = data['Frustrations / Pain Points'];
      } else if (typeof data['Frustrations / Pain Points'] === 'object') {
        const painValues = Object.values(data['Frustrations / Pain Points'] as Record<string, string[]>);
        persona.painPoints = painValues.flat();
      }
    }
    
    // Extract emotional triggers (Simplified from original for brevity, ensure it matches full logic)
    if (data['Emotional Triggers']) {
      if (Array.isArray(data['Emotional Triggers'])) {
        persona.emotionalTriggers.raw = data['Emotional Triggers'];
      } else if (typeof data['Emotional Triggers'] === 'object' && (data['Emotional Triggers'] as any).Positive) {
        persona.emotionalTriggers.positive = (data['Emotional Triggers'] as any).Positive || [];
        persona.emotionalTriggers.negative = (data['Emotional Triggers'] as any).Negative || [];
      }
    }
    
    // Extract regional nuances
    if (data['Regional Nuances']) {
      if (Array.isArray(data['Regional Nuances'])) {
        persona.regionalNuances = data['Regional Nuances'];
      } else if (typeof data['Regional Nuances'] === 'object') {
        persona.regionalNuances = Object.entries(data['Regional Nuances']).map(
          ([key, value]) => `${key}: ${value}`
        );
      }
    } else if (data[`${region.toUpperCase()} Differentiation`]) {
      const diffField = `${region.toUpperCase()} Differentiation`;
      if (Array.isArray(data[diffField])) persona.regionalNuances = data[diffField] as string[];
      // simplified
    }
    
    // Extract behaviors
    if (data['Behaviors']) {
      if (Array.isArray(data['Behaviors'])) {
        persona.behaviors = data['Behaviors'];
      } else if (typeof data['Behaviors'] === 'object') {
        persona.behaviors = (Object.values(data['Behaviors'] as Record<string, string[]>)).flat();
      }
    }
    
    // Extract key responsibilities
    if (data['Key Responsibilities']) {
      if (Array.isArray(data['Key Responsibilities'])) {
        persona.keyResponsibilities = data['Key Responsibilities'];
      } else if (typeof data['Key Responsibilities'] === 'object') {
        persona.keyResponsibilities = (Object.values(data['Key Responsibilities'] as Record<string, string[]>)).flat();
      }
    }
    
    // Extract collaboration insights
    if (data['Collaboration Insights']) {
      if (Array.isArray(data['Collaboration Insights'])) {
        persona.collaborationInsights = data['Collaboration Insights'];
      } else if (typeof data['Collaboration Insights'] === 'object') {
        persona.collaborationInsights = (Object.values(data['Collaboration Insights'] as Record<string, string[]>)).flat();
      }
    }
    return persona;
  }
}

// Get a specific country persona
function getCountryPersona(region: Region, department: Department): CountryPersona | null {
  // Skip global region for now
  if (region === 'global') {
    console.log(`Skipping global region for now`);
    return null;
  }
  
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, region, department, `${department}.json`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`File does not exist: ${filePath}`);
    return null;
  }
  
  // Read the data
  const data = readJsonFile(filePath);
  if (!data) return null;
  
  // Normalize the country-specific data
  try {
    return normalizePersonaData(data, region, department) as CountryPersona; // Cast as CountryPersona if function returns Persona
  } catch (error) {
    console.error(`Error normalizing persona data from ${filePath}:`, error);
    return null;
  }
}

// Get all personas for a specific region
function getPersonasByRegion(region: Region): Persona[] {
  const personas: Persona[] = [];
  const dataDir = path.join(process.cwd(), 'data', region);

  // Check if directory exists
  if (!fs.existsSync(dataDir)) {
    console.log(`Directory does not exist: ${dataDir}`);
    return [];
  }

  try {
    // Get all department directories
    const departmentDirs = fs.readdirSync(dataDir)
      .filter(dir => !dir.startsWith('.')) // Skip hidden files
      .filter(dir => {
        const stat = fs.statSync(path.join(dataDir, dir));
        return stat.isDirectory();
      }); // No longer filter by a hardcoded list of departments

    // Process each department
    for (const dept of departmentDirs) {
      const filePath = path.join(dataDir, dept, `${dept}.json`);

      if (!fs.existsSync(filePath)) {
        // Attempt to read <region_name>.json if <department_name>.json doesn't exist (for global personas)
        const regionFilePath = path.join(dataDir, dept, `${region}.json`);
        if (fs.existsSync(regionFilePath)) {
          const data = readJsonFile(regionFilePath);
          if (data) {
            // Assuming normalizePersonaData can handle global data structure or we need a normalizeGlobalPersona
            // For now, let's assume normalizePersonaData is flexible enough or we'll adapt it later.
            // The department for global personas might be considered the folder name itself.
            const persona = normalizePersonaData(data, region, dept as Department);
            personas.push(persona);
          }
        } else {
          console.log(`Skipping non-existent file(s): ${filePath} and ${regionFilePath}`);
        }
        continue;
      }
      
      const data = readJsonFile(filePath);
      if (data) {
        // For global, the department is the folder name, e.g., 'ceo', 'sales'
        // For regional, it's also the folder name.
        const persona = normalizePersonaData(data, region, dept as Department);
        personas.push(persona);
      }
    }
    
    return personas;
  } catch (error) {
    console.error(`Error reading directories in ${dataDir}:`, error);
    return [];
  }
}

// Get all personas
function getAllPersonas(): Persona[] {
  const dataRootDir = path.join(process.cwd(), 'data');
  let allPersonas: Persona[] = [];

  if (!fs.existsSync(dataRootDir)) {
    console.error('Root data directory does not exist:', dataRootDir);
    return [];
  }

  try {
    const regions = fs.readdirSync(dataRootDir)
      .filter(item => !item.startsWith('.') && item !== 'archive') // Exclude hidden files and 'archive' folder
      .filter(item => fs.statSync(path.join(dataRootDir, item)).isDirectory()) as Region[];

    for (const region of regions) {
      const regionPersonas = getPersonasByRegion(region);
      allPersonas = [...allPersonas, ...regionPersonas];
    }
  } catch (error) {
    console.error('Error scanning data directory for regions:', error);
    return [];
  }
  
  return allPersonas;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') as Region | null;
  const department = searchParams.get('department') as Department | null;
  
  try {
    // If both region and department are specified, return a specific persona
    if (region && department) {
      let persona = null;
      
      // Skip global region
      if (region !== 'global') {
        persona = getCountryPersona(region, department);
      }
      
      if (!persona) {
        return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
      }
      
      return NextResponse.json(persona);
    } 
    // If only region is specified, return all personas for that region
    else if (region) {
      const personas = getPersonasByRegion(region);
      return NextResponse.json(personas);
    } 
    // Otherwise, return all personas
    else {
      const personas = getAllPersonas();
      return NextResponse.json(personas);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
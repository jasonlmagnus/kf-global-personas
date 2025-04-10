import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Persona, CountryPersona, Region, Department } from '@/types/personas';

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

// Convert raw data into a normalized Country Persona
function normalizeCountryPersona(data: PersonaJsonData, region: Region, department: Department): CountryPersona {
  // Get all the direct string values
  const persona: CountryPersona = {
    id: `${region}-${department}`,
    title: data['Profession/Role'] || `${region.toUpperCase()} ${department.replace('_', ' ').toUpperCase()}`,
    department,
    region,
    isGlobal: false,
    userGoalStatement: data['User Goal Statement'] || '',
    quote: data['User Quote'] || '',
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
      // Extract all values from nested object and flatten them
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
  
  // Extract emotional triggers
  if (data['Emotional Triggers']) {
    if (Array.isArray(data['Emotional Triggers'])) {
      // If it's an array of objects with Trigger, Emotional Response, Messaging Implication
      persona.emotionalTriggers.raw = data['Emotional Triggers'];
    } else if (data['Emotional Triggers'].Positive || data['Emotional Triggers'].Negative) {
      // If it's an object with Positive/Negative arrays
      persona.emotionalTriggers.positive = data['Emotional Triggers'].Positive || [];
      persona.emotionalTriggers.negative = data['Emotional Triggers'].Negative || [];
    }
  }
  
  // Extract regional nuances
  if (data['Regional Nuances']) {
    if (Array.isArray(data['Regional Nuances'])) {
      persona.regionalNuances = data['Regional Nuances'];
    } else if (typeof data['Regional Nuances'] === 'object') {
      // If it's an object with key-value pairs
      persona.regionalNuances = Object.entries(data['Regional Nuances']).map(
        ([key, value]) => `${key}: ${value}`
      );
    }
  } else if (data[`${region.toUpperCase()} Differentiation`]) {
    // Alternative field name
    const diffField = `${region.toUpperCase()} Differentiation`;
    if (typeof data[diffField] === 'object') {
      persona.regionalNuances = Object.entries(data[diffField]).map(
        ([key, value]) => `${key}: ${value}`
      );
    } else if (Array.isArray(data[diffField])) {
      persona.regionalNuances = data[diffField];
    }
  }
  
  // Extract behaviors
  if (data['Behaviors']) {
    if (Array.isArray(data['Behaviors'])) {
      persona.behaviors = data['Behaviors'];
    } else if (typeof data['Behaviors'] === 'object') {
      const behaviorValues = Object.values(data['Behaviors']) as any[];
      persona.behaviors = behaviorValues.flat();
    }
  }
  
  // Extract key responsibilities
  if (data['Key Responsibilities']) {
    if (Array.isArray(data['Key Responsibilities'])) {
      persona.keyResponsibilities = data['Key Responsibilities'];
    } else if (typeof data['Key Responsibilities'] === 'object') {
      const respValues = Object.values(data['Key Responsibilities']) as any[];
      persona.keyResponsibilities = respValues.flat();
    }
  }
  
  // Extract collaboration insights
  if (data['Collaboration Insights']) {
    if (Array.isArray(data['Collaboration Insights'])) {
      persona.collaborationInsights = data['Collaboration Insights'];
    } else if (typeof data['Collaboration Insights'] === 'object') {
      const insightValues = Object.values(data['Collaboration Insights']) as any[];
      persona.collaborationInsights = insightValues.flat();
    }
  }
  
  return persona;
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
    return normalizeCountryPersona(data, region, department);
  } catch (error) {
    console.error(`Error normalizing persona data from ${filePath}:`, error);
    return null;
  }
}

// Get all personas for a specific region
function getPersonasByRegion(region: Region): Persona[] {
  const personas: Persona[] = [];
  
  // Skip global region for now
  if (region === 'global') {
    console.log(`Skipping global region for now`);
    return [];
  }
  
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
      })
      .filter(dir => ['ceo', 'chro', 'sales', 'talent', 'rewards', 'leadership_dev'].includes(dir));
    
    // Process each department
    for (const dept of departmentDirs) {
      const filePath = path.join(dataDir, dept, `${dept}.json`);
      
      if (!fs.existsSync(filePath)) {
        console.log(`Skipping non-existent file: ${filePath}`);
        continue;
      }
      
      const data = readJsonFile(filePath);
      if (data) {
        const persona = normalizeCountryPersona(data, region, dept as Department);
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
  // Only use country regions for now
  const regions: Region[] = ['uk', 'uae', 'aus'];
  let allPersonas: Persona[] = [];
  
  for (const region of regions) {
    const regionPersonas = getPersonasByRegion(region);
    allPersonas = [...allPersonas, ...regionPersonas];
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
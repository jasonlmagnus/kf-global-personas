import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Persona, GlobalPersona, CountryPersona, Region, Department } from '@/types/personas';

// Define interfaces for the JSON data structure
interface PersonaJsonData {
  'Profession/Role'?: string;
  'User Goal Statement'?: string;
  'User_Goal_Statement'?: string;
  'User Quote'?: string;
  'Needs'?: string[] | Record<string, string[]>;
  'Motivations'?: string[] | Record<string, string[]>;
  'Frustrations / Pain Points'?: string[] | Record<string, string[]>;
  'Frustrations_Pain_Points'?: string[] | Record<string, string[]>;
  'Frustrations'?: string[] | Record<string, string[]>;
  'Core_Belief'?: string;
  'Core Belief'?: string;
  'Emotional Triggers'?: {
    Positive?: string[];
    Negative?: string[];
  } | Array<Record<string, string>>;
  'Emotional_Triggers'?: {
    Positive?: string[];
    Negative?: string[];
  } | Array<Record<string, string>>;
  'Regional Nuances'?: string[] | Record<string, string>;
  'Cultural Context'?: string;
  'Behaviors'?: string[] | Record<string, string[]>;
  'Key Responsibilities'?: string[] | Record<string, string[]>;
  'Key_Responsibilities'?: string[] | Record<string, string[]>;
  'Collaboration Insights'?: string[] | Record<string, string[]>;
  'Collaboration_Insights'?: string[] | Record<string, string[]>;
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

// Helper function to process arrays that might contain strings or objects with Category/Description
const processArrayField = (fieldData: any): string[] => {
  if (Array.isArray(fieldData)) {
    return fieldData.map(item => {
      if (typeof item === 'string') return item;
      // Handle objects, prioritizing a 'Description' field if available
      if (typeof item === 'object' && item !== null) {
        if (typeof item.Description === 'string') {
          return typeof item.Category === 'string' && item.Category ? `${item.Category}: ${item.Description}` : item.Description;
        }
        // Fallback for other object structures if necessary, could be more specific
        // For now, let's stringify if no Description, or consider it an error/skip.
        // return JSON.stringify(item); // This might be too noisy or undesirable.
        return undefined; // Or skip item if it's an object without Description
      }
      return String(item); // Catch-all for other simple types, convert to string
    }).filter(item => typeof item === 'string') as string[]; // Ensure only strings and filter out undefined
  } else if (typeof fieldData === 'object' && fieldData !== null) {
    // Handle cases like Record<string, string[]> from PersonaJsonData by flattening
    // This assumes values are string[] or string, then flattens.
    return Object.values(fieldData as Record<string, string[] | string>).flat().filter(item => typeof item === 'string');
  }
  return []; // Default to empty array if fieldData is not an array or suitable object
};

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
                     (typeof data['User Goal Statement'] === 'string' ? data['User Goal Statement'] :
                     (typeof data['User_Goal_Statement'] === 'string' ? data['User_Goal_Statement'] : '')),
      quote: typeof data['Quote'] === 'string' ? data['Quote'] :
             (typeof data['User Quote'] === 'string' ? data['User Quote'] : undefined),
      
      // Extract Core Belief
      coreBelief: typeof data['Core_Belief'] === 'string' ? data['Core_Belief'] :
                 (typeof data['Core Belief'] === 'string' ? data['Core Belief'] : undefined),
      
      // Use processArrayField for all list-based properties
      needs: processArrayField(data['Needs']),
      motivations: processArrayField(data['Motivations']),
      keyResponsibilities: processArrayField(data['Key Responsibilities'] || data['Key_Responsibilities']),
      knowledgeOrExpertise: processArrayField(data['Knowledge_Areas']),
      typicalChallenges: processArrayField(data['Typical_Challenges']),
      currentProjects: processArrayField(data['Current_Projects']),
      painPoints: processArrayField(data['Frustrations_Pain_Points'] || data['Frustrations / Pain Points'] || data['Frustrations']),
      behaviors: processArrayField(data['Behaviors']),
      collaborationInsights: processArrayField(data['Collaboration Insights'] || data['Collaboration_Insights']),
      
      // Initialize emotionalTriggers
      emotionalTriggers: {
        positive: [],
        negative: []
      }
    };

    // Process emotional triggers for global persona
    if (data['Emotional_Triggers'] || data['Emotional Triggers']) {
      const triggerData = data['Emotional_Triggers'] || data['Emotional Triggers'];
      
      if (Array.isArray(triggerData)) {
        // For arrays of {Trigger, Emotional_Response, Messaging_Implication} objects
        persona.emotionalTriggers.raw = triggerData;
      } else if (typeof triggerData === 'object' && triggerData !== null) {
        // For objects with Positive/Negative keys
        if ((triggerData as any).Positive) {
          persona.emotionalTriggers.positive = (triggerData as any).Positive || [];
        }
        if ((triggerData as any).Negative) {
          persona.emotionalTriggers.negative = (triggerData as any).Negative || [];
        }
      }
    }
    
    return persona;
  } else {
    // Handle CountryPersona (existing logic, but ensure return type is CountryPersona)
    // Ensure similar processing for its array fields if they can also contain objects
    const countryPainPointsKey = data['Frustrations_Pain_Points'] ? 'Frustrations_Pain_Points' : 
                                (data['Frustrations / Pain Points'] ? 'Frustrations / Pain Points' : 'Frustrations');

    const persona: CountryPersona = {
      id: `${region}-${department}`,
      title: data['Profession/Role'] || `${region.toUpperCase()} ${department.replace('_', ' ').toUpperCase()}`,
      department,
      region,
      isGlobal: false,
      userGoalStatement: typeof data['User Goal Statement'] === 'string' ? data['User Goal Statement'] :
                         (typeof data['User_Goal_Statement'] === 'string' ? data['User_Goal_Statement'] : ''),
      quote: data['User Quote'] || undefined,
      needs: processArrayField(data['Needs']),
      motivations: processArrayField(data['Motivations']),
      painPoints: processArrayField(data[countryPainPointsKey]),
      emotionalTriggers: {
        positive: [],
        negative: []
      },
      regionalNuances: [], // This might need processArrayField if source can be objects
      culturalContext: data['Cultural Context'] || '',
      behaviors: processArrayField(data['Behaviors']),
      keyResponsibilities: processArrayField(data['Key Responsibilities'] || data['Key_Responsibilities']),
      collaborationInsights: processArrayField(data['Collaboration Insights'] || data['Collaboration_Insights']),
      presentation: data['Presentation Guidance'] || {},
      comparison: data['Comparison to Generic CEO'] || [] // This is likely an array of complex objects, not strings
    };
    
    // Original logic for emotionalTriggers and regionalNuances for CountryPersona might still be needed
    // if processArrayField is too generic for them or their structure is more complex.

    // Extract emotional triggers (Simplified from original for brevity, ensure it matches full logic)
    if (data['Emotional Triggers']) {
      if (Array.isArray(data['Emotional Triggers'])) {
        // If it's an array of {Trigger, Emotional_Response, Messaging_Implication} objects
        // The type on CountryPersona is {positive: string[], negative: string[], raw?: any[]}
        // This current 'raw' assignment does not match the intent for positive/negative strings.
        // This needs careful review if we want to populate positive/negative based on complex objects.
        persona.emotionalTriggers.raw = data['Emotional Triggers']; 
      } else if (typeof data['Emotional Triggers'] === 'object' && (data['Emotional Triggers'] as any).Positive) {
        persona.emotionalTriggers.positive = (data['Emotional Triggers'] as any).Positive || [];
        persona.emotionalTriggers.negative = (data['Emotional Triggers'] as any).Negative || [];
      } else if (typeof data['Emotional Triggers'] === 'object') {
        // If it's an object like { Performance_Pressure: "Anxiety...", ... }
        // Convert to string array for 'raw' or decide how to map to positive/negative
        const triggersAsStrings = Object.entries(data['Emotional Triggers']).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`);
        if (!persona.emotionalTriggers.raw) persona.emotionalTriggers.raw = [];
        persona.emotionalTriggers.raw.push(...triggersAsStrings);
      }
    }
    
    // Extract regional nuances
    // The CountryPersona type has regionalNuances as string[]. Original logic was more specific.
    const regionalNuancesData = data['Regional Nuances'] || data[`${region.toUpperCase()} Differentiation`];
    if (regionalNuancesData) {
      if (Array.isArray(regionalNuancesData)) {
        persona.regionalNuances = regionalNuancesData.filter(item => typeof item === 'string');
        // If items can be objects, need to map them like in processArrayField
      } else if (typeof regionalNuancesData === 'object') {
        persona.regionalNuances = Object.entries(regionalNuancesData).map(
          ([key, value]) => `${key}: ${value}`
        );
      }
    }
    // `comparison` field on CountryPersona is `any[]` - it will take whatever `data['Comparison to Generic CEO']` is.
    return persona;
  }
}

// New function to get a specific persona by ID (region and department)
function getPersonaById(region: Region, department: Department): Persona | null {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, region, department, `${department}.json`); // Standard path

  if (!fs.existsSync(filePath)) {
    // REMOVED: Special handling for ceo_board and ceo_persona_card.json
    // Now strictly expects {department}.json
    console.log(`File does not exist: ${filePath}`);
    return null;
  }

  const jsonData = readJsonFile(filePath);
  if (!jsonData) return null;

  try {
    return normalizePersonaData(jsonData, region, department);
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
      const persona = getPersonaById(region, department);
      
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
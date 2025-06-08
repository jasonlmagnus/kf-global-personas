import fs from 'fs';
import path from 'path';
import { Persona, GlobalPersona, CountryPersona, GlobalPersonaV3, Region, Department, isGlobalPersonaV3 } from '@/types/personas';
import { formatDepartmentName } from '@/lib/personaUtils';

// Define interfaces for the JSON data structure
interface PersonaJsonData {
  Role?: string;
  'User Goal Statement'?: string;
  User_Goal_Statement?: string;
  'User Quote'?: string;
  Needs?: string[] | Record<string, string[]>;
  Motivations?: string[] | Record<string, string[]>;
  'Frustrations / Pain Points'?: string[] | Record<string, string[]>;
  Frustrations_Pain_Points?: string[] | Record<string, string[]>;
  Frustrations?: string[] | Record<string, string[]>;
  Core_Belief?: string;
  'Core Belief'?: string;
  'Emotional Triggers'?: { Positive?: string[]; Negative?: string[]; } | Array<Record<string, string>>;
  Emotional_Triggers?: { Positive?: string[]; Negative?: string[]; } | Array<Record<string, string>>;
  'Regional Nuances'?: string[] | Record<string, string>;
  'Cultural Context'?: string;
  Behaviors?: string[] | Record<string, string[]>;
  'Key Responsibilities'?: string[] | Record<string, string[]>;
  Key_Responsibilities?: string[] | Record<string, string[]>;
  'Collaboration Insights'?: string[] | Record<string, string[]>;
  Collaboration_Insights?: string[] | Record<string, string[]>;
  'Presentation Guidance'?: Record<string, unknown>;
  'Comparison to Generic CEO'?: string[];
  Knowledge_Areas?: string[];
  Typical_Challenges?: string[];
  Current_Projects?: string[];
  Goals?: string[] | Record<string, string[]>;
  Key_Motivations?: string[] | Record<string, string[]>;
  [key: string]: unknown;
}

// Server-side function to read JSON files
function readJsonFile(filePath: string): PersonaJsonData | null {
  try {
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
      if (typeof item === 'object' && item !== null) {
        if (typeof item.Description === 'string') {
          return typeof item.Category === 'string' && item.Category ? `${item.Category}: ${item.Description}` : item.Description;
        }
        return undefined; 
      }
      return String(item); 
    }).filter(item => typeof item === 'string') as string[];
  } else if (typeof fieldData === 'object' && fieldData !== null) {
    return Object.values(fieldData as Record<string, string[] | string>).flat().filter(item => typeof item === 'string');
  }
  return [];
};

// Helper function to process Record<string, string[]> fields
const processRecordField = (fieldData: any): Record<string, string[]> => {
  if (Array.isArray(fieldData)) {
    // Convert array to a single category
    return { "General": fieldData.filter(item => typeof item === 'string') };
  } else if (typeof fieldData === 'object' && fieldData !== null) {
    // Ensure all values are string arrays
    const result: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(fieldData)) {
      if (Array.isArray(value)) {
        result[key] = value.filter(item => typeof item === 'string');
      } else if (typeof value === 'string') {
        result[key] = [value];
      }
    }
    return result;
  }
  return {};
};

// Helper function to ensure a value is a string, providing a fallback if not.
const ensureString = (value: any, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

// Helper function to ensure a value is an array of strings.
const ensureStringArray = (value: any): string[] => {
  if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => String(item));
  }
  return [];
};

function getPersonaById(region: Region, department: Department): Persona | null {
  const regions: Region[] = region === 'global' ? ['global'] : [region];
  
  for (const reg of regions) {
    const filePath = path.join(process.cwd(), 'data', reg, department, `${department}.json`);
    
    const data = readJsonFile(filePath);
    
    if (data) {
      try {
        return normalizePersonaData(data, reg, department);
      } catch (error) {
        console.error(`Error normalizing persona data for ${reg}-${department}:`, error);
        continue;
      }
    }
  }
  
  return null;
}

function normalizePersonaData(data: PersonaJsonData | GlobalPersonaV3, region: Region, department: Department): Persona {
  // Check if data is already in v3 format
  if ('metadata' in data && typeof data.metadata === 'object' && data.metadata !== null && 'type' in data.metadata && data.metadata.type === 'global') {
    const v3Data = data as GlobalPersonaV3;
    return {
      ...v3Data,
      id: `${region}-${department}`,
      title: `Global ${formatDepartmentName(department)}`,
      department,
      region,
      isGlobal: true,
      type: "global"
    } as GlobalPersonaV3;
  }
  
  const jsonData = data as PersonaJsonData;
  
  const baseRole = (typeof jsonData['Role'] === 'string' && jsonData['Role'].trim() !== '') 
                   ? jsonData['Role'].trim() 
                   : formatDepartmentName(department);

  const formatRegionNameForTitle = (reg: Region): string => {
    if (reg === 'aus') return 'Australian';
    if (reg === 'uk') return 'UK';
    if (reg === 'uae') return 'UAE';
    return reg.charAt(0).toUpperCase() + reg.slice(1);
  };

  if (region === 'global') {
    const globalTitle = `Global ${baseRole}`;

    const ensureCategoryDescriptionArray = (fieldData: any): Array<{ Category: string; Description: string }> => {
      if (Array.isArray(fieldData) && fieldData.every(item => 
          typeof item === 'object' && item !== null && 
          typeof item.Category === 'string' && typeof item.Description === 'string')) {
        return fieldData as Array<{ Category: string; Description: string }>;
      }
      return [];
    };
    
    const persona: GlobalPersona = {
      id: `${region}-${department}`,
      title: globalTitle,
      department,
      region,
      isGlobal: true,
      type: "global",
      roleOverview: ensureString(jsonData.Core_Belief || jsonData.Role_Overview),
      goalStatement: ensureString(jsonData['Goal Statement'] || jsonData['User Goal Statement'] || jsonData['User_Goal_Statement']),
      quote: ensureString(jsonData['Quote'] || jsonData['User Quote'], undefined),
      coreBelief: ensureString(jsonData['Core_Belief'] || jsonData['Core Belief'], undefined),
      keyRelationships: ensureStringArray(jsonData.Key_Relationships),
      uniquePerspective: ensureString(jsonData.Unique_Perspective),
      kpis: ensureStringArray(jsonData.KPIs),
      
      needs: ensureCategoryDescriptionArray(jsonData.Needs),
      keyResponsibilities: ensureCategoryDescriptionArray(jsonData['Key Responsibilities'] || jsonData.Key_Responsibilities),
      
      motivations: processArrayField(jsonData.Motivations),
      knowledgeOrExpertise: processArrayField(jsonData.Knowledge_Areas),
      typicalChallenges: processArrayField(jsonData.Typical_Challenges),
      currentProjects: processArrayField(jsonData.Current_Projects),
      painPoints: processArrayField(jsonData.Frustrations_Pain_Points || jsonData['Frustrations / Pain Points'] || jsonData.Frustrations),
      behaviors: processArrayField(jsonData.Behaviors),
      collaborationInsights: processArrayField(jsonData['Collaboration Insights'] || jsonData.Collaboration_Insights),
      
      emotionalTriggers: {
        positive: ensureStringArray((jsonData.Emotional_Triggers as any)?.Positive || (jsonData['Emotional Triggers'] as any)?.Positive),
        negative: ensureStringArray((jsonData.Emotional_Triggers as any)?.Negative || (jsonData['Emotional Triggers'] as any)?.Negative),
        raw: []
      },
      perceptionGaps: [],
      connectionOpportunities: [],
      analogies: processArrayField(jsonData.Analogies),
      referenceSources: []
    };
    
    return persona;
  } else {
    // Country persona logic
    const countryTitle = `${formatRegionNameForTitle(region)} ${baseRole}`;
    
    const persona: CountryPersona = {
      id: `${region}-${department}`,
      title: countryTitle,
      department,
      region,
      isGlobal: false,
      type: "country",
      userGoalStatement: ensureString(jsonData['User Goal Statement'] || jsonData['User_Goal_Statement']),
      quote: ensureString(jsonData['User Quote'], undefined),
      
      needs: processRecordField(jsonData.Needs),
      motivations: processRecordField(jsonData.Motivations),
      painPoints: processRecordField(jsonData.Frustrations_Pain_Points || jsonData['Frustrations / Pain Points'] || jsonData.Frustrations),
      behaviors: processRecordField(jsonData.Behaviors),
      keyResponsibilities: processRecordField(jsonData['Key Responsibilities'] || jsonData.Key_Responsibilities),
      collaborationInsights: processRecordField(jsonData['Collaboration Insights'] || jsonData.Collaboration_Insights),
      
      culturalContext: ensureString(jsonData['Cultural Context'], undefined),
      
      emotionalTriggers: {
        positive: ensureStringArray((jsonData.Emotional_Triggers as any)?.Positive || (jsonData['Emotional Triggers'] as any)?.Positive),
        negative: ensureStringArray((jsonData.Emotional_Triggers as any)?.Negative || (jsonData['Emotional Triggers'] as any)?.Negative)
      }
    };
    
    return persona;
  }
}

// DEPRECATED: This function has been replaced by the API endpoint /api/personas
// The working getAllPersonas implementation is now in src/app/api/personas/route.ts
// Use fetch('/api/personas') or the personaAdapter instead
// export function getAllPersonas(): Persona[] {
//   const allPersonas: Persona[] = [];
//   const regions: Region[] = ['global', 'uk', 'aus', 'uae'];
//   const departments: Department[] = ['ceo', 'chro', 'sales', 'talent', 'rewards', 'leadership_dev'];
  
//   for (const region of regions) {
//     for (const department of departments) {
//       const persona = getPersonaById(region, department);
//       if (persona) {
//         allPersonas.push(persona);
//       }
//     }
//   }
  
//   return allPersonas;
// } 
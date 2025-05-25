import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Persona, GlobalPersona, CountryPersona, Region, Department } from '@/types/personas';
import { formatDepartmentName } from '@/lib/personaUtils';

// Define interfaces for the JSON data structure
interface PersonaJsonData {
  Role?: string; // Ensure this is the only role field
  'User Goal Statement'?: string;
  User_Goal_Statement?: string; // Keep this for compatibility
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
  Knowledge_Areas?: string[]; // Added from previous logic
  Typical_Challenges?: string[]; // Added from previous logic
  Current_Projects?: string[]; // Added from previous logic
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

// Helper function to ensure a value is a string, providing a fallback if not.
const ensureString = (value: any, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

// Helper function to ensure a value is an array of strings.
const ensureStringArray = (value: any): string[] => {
  if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
    return value;
  }
  if (Array.isArray(value)) { // If it's an array but not all strings, convert items to string
    return value.map(item => String(item));
  }
  return [];
};

// Helper to transform emotional triggers raw data (Array of objects) into string[]
const transformEmotionalTriggersRawToStringArray = (triggerDataInput: any): string[] => {
    if (!Array.isArray(triggerDataInput)) return [];
    return triggerDataInput.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null && item.Trigger && item.Emotional_Response) {
            let base = `${item.Trigger}: ${item.Emotional_Response}`;
            if (item.Messaging_Implication) {
                base += ` - Messaging: ${item.Messaging_Implication}`;
            }
            return base;
        }
        return "Invalid trigger data"; // Or some other placeholder/error string
    }).filter(item => item !== "Invalid trigger data");
};

// Helper to transform reference sources (Array of objects) into string[]
const transformReferenceSourcesToStringArray = (sourcesData: any): string[] => {
    if (!Array.isArray(sourcesData)) return [];
    return sourcesData.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null && item.Category && Array.isArray(item.Sources)) {
            return `${item.Category}: ${item.Sources.join(', ')}`;
        }
        return "Invalid reference source";
    }).filter(item => item !== "Invalid reference source");
};

// Convert raw data into a normalized Persona
function normalizePersonaData(data: PersonaJsonData, region: Region, department: Department): Persona {
  const baseRole = (typeof data['Role'] === 'string' && data['Role'].trim() !== '') 
                   ? data['Role'].trim() 
                   : formatDepartmentName(department); // Fallback if 'Role' is missing

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
      console.warn(`WARN: Global persona field (e.g. Needs/KeyResponsibilities) expected Array<Category/Description objects>, received: ${JSON.stringify(fieldData)}. Returning empty array.`);
      return [];
    };
    
    const persona: GlobalPersona = {
      id: `${region}-${department}`,
      title: globalTitle,
      department,
      region,
      isGlobal: true,
      type: "global",
      roleOverview: ensureString(data.Core_Belief || data.Role_Overview), // Using Core_Belief as placeholder, or Role_Overview if exists
      goalStatement: ensureString(data['Goal Statement'] || data['User Goal Statement'] || data['User_Goal_Statement']),
      quote: ensureString(data['Quote'] || data['User Quote'], undefined), // ensureString can take undefined as fallback
      coreBelief: ensureString(data['Core_Belief'] || data['Core Belief'], undefined),
      keyRelationships: ensureStringArray(data.Key_Relationships), // New field
      uniquePerspective: ensureString(data.Unique_Perspective), // New field
      kpis: ensureStringArray(data.KPIs), // New field
      
      needs: ensureCategoryDescriptionArray(data.Needs),
      keyResponsibilities: ensureCategoryDescriptionArray(data['Key Responsibilities'] || data.Key_Responsibilities),
      
      motivations: processArrayField(data.Motivations),
      knowledgeOrExpertise: processArrayField(data.Knowledge_Areas),
      typicalChallenges: processArrayField(data.Typical_Challenges),
      currentProjects: processArrayField(data.Current_Projects),
      painPoints: processArrayField(data.Frustrations_Pain_Points || data['Frustrations / Pain Points'] || data.Frustrations),
      behaviors: processArrayField(data.Behaviors),
      collaborationInsights: processArrayField(data['Collaboration Insights'] || data.Collaboration_Insights),
      
      emotionalTriggers: {
        positive: ensureStringArray((data.Emotional_Triggers as any)?.Positive || (data['Emotional Triggers'] as any)?.Positive),
        negative: ensureStringArray((data.Emotional_Triggers as any)?.Negative || (data['Emotional Triggers'] as any)?.Negative),
        raw: transformEmotionalTriggersRawToStringArray((data.Emotional_Triggers as any)?.Raw || data.Emotional_Triggers || data['Emotional Triggers'])
      },
      perceptionGaps: Array.isArray(data.Perception_Gaps) && data.Perception_Gaps.every(item => typeof item === 'object' && item !==null) ? data.Perception_Gaps as any : [],
      connectionOpportunities: Array.isArray(data.Connection_Opportunities) && data.Connection_Opportunities.every(item => typeof item === 'object' && item !==null) ? data.Connection_Opportunities as any : [],
      analogies: processArrayField(data.Analogies), 
      referenceSources: transformReferenceSourcesToStringArray(data.Reference_Sources),
      problemSolvingMethod: ensureString(data.Problem_Solving_Method, undefined) // Changed to ensureString for single string
    };
    return persona;

  } else { // Country Persona
    const countryTitle = `${formatRegionNameForTitle(region)} ${baseRole}`;

    const countryPainPointsKey = data.Frustrations_Pain_Points ? 'Frustrations_Pain_Points' : 
                                (data['Frustrations / Pain Points'] ? 'Frustrations / Pain Points' : 'Frustrations');

    const rawNeeds = data.Needs;
    const countryNeeds = (typeof rawNeeds === 'object' && !Array.isArray(rawNeeds) && rawNeeds !== null) 
                       ? rawNeeds as Record<string, string[]> 
                       : {};

    const rawMotivations = data.Motivations;
    const countryMotivations = (typeof rawMotivations === 'object' && !Array.isArray(rawMotivations) && rawMotivations !== null) 
                             ? rawMotivations as Record<string, string[]> 
                             : {};

    const rawPainPoints = data[countryPainPointsKey!]; 
    const countryPainPoints = (typeof rawPainPoints === 'object' && !Array.isArray(rawPainPoints) && rawPainPoints !== null) 
                            ? rawPainPoints as Record<string, string[]> 
                            : {};

    const rawKeyResponsibilitiesSource = data['Key Responsibilities'] || data.Key_Responsibilities;
    const countryKeyResponsibilities = (typeof rawKeyResponsibilitiesSource === 'object' && !Array.isArray(rawKeyResponsibilitiesSource) && rawKeyResponsibilitiesSource !== null)
                                   ? rawKeyResponsibilitiesSource as Record<string, string[]>
                                   : {};
    
    const rawBehaviors = data.Behaviors;
    const countryBehaviors = (typeof rawBehaviors === 'object' && !Array.isArray(rawBehaviors) && rawBehaviors !== null)
                           ? rawBehaviors as Record<string, string[]>
                           : {};

    const rawCollaborationInsightsSource = data['Collaboration Insights'] || data.Collaboration_Insights;
    const countryCollaborationInsights = (typeof rawCollaborationInsightsSource === 'object' && !Array.isArray(rawCollaborationInsightsSource) && rawCollaborationInsightsSource !== null)
                                       ? rawCollaborationInsightsSource as Record<string, string[]>
                                       : {};
    
    // For regionalNuances (e.g., Australian_Differentiation from JSON)
    const regionalNuancesData = data['Regional Nuances'] || data[`${region.toUpperCase()} Differentiation`] || data['Australian_Differentiation'];
    const countryRegionalNuances: Record<string, string> = {};
    if (typeof regionalNuancesData === 'object' && regionalNuancesData !== null && !Array.isArray(regionalNuancesData)) {
        for (const [key, value] of Object.entries(regionalNuancesData)) {
            if (typeof value === 'string') {
                countryRegionalNuances[key] = value;
            }
        }
    }

    // For presentation guidance
    const presentationData = data['Presentation Guidance'] || data.Presentation_Guidance;
    const countryPresentation: Record<string, string> = {};
    if (typeof presentationData === 'object' && presentationData !== null && !Array.isArray(presentationData)) {
        for (const [key, value] of Object.entries(presentationData)) {
            if (typeof value === 'string') {
                countryPresentation[key] = value;
            }
        }
    }
    
    // For comparison data
    const comparisonData = data['Comparison to Generic CEO'] || data.Comparison_to_Generic_CEO;
    // Define the expected type for a comparison item
    type ComparisonItem = {
        "Key Dimension": string;
        "Generic CEO Persona": string;
        "Australian CEO Persona": string; 
        "Value-Add for Australian Context": string; 
    };
    let countryComparison: Array<ComparisonItem> = [];
    if (Array.isArray(comparisonData)) {
        countryComparison = comparisonData.filter(item => 
            typeof item === 'object' && item !== null &&
            typeof item["Key Dimension"] === 'string' &&
            typeof item["Generic CEO Persona"] === 'string' &&
            typeof item["Australian CEO Persona"] === 'string' && // Adjust this key if it varies per country, e.g., item[`${formatRegionNameForTitle(region)} CEO Persona`]
            typeof item["Value-Add for Australian Context"] === 'string' // Adjust this key if it varies per country
        ) as Array<ComparisonItem>;
    }

    const persona: CountryPersona = {
      id: `${region}-${department}`,
      title: countryTitle,
      department,
      region,
      isGlobal: false,
      type: "country",
      userGoalStatement: ensureString(data['User Goal Statement'] || data.User_Goal_Statement),
      quote: ensureString(data['User Quote'], undefined),
      needs: countryNeeds,
      motivations: countryMotivations,
      painPoints: countryPainPoints,
      keyResponsibilities: countryKeyResponsibilities,
      behaviors: countryBehaviors,
      collaborationInsights: countryCollaborationInsights,
      emotionalTriggers: {
        positive: ensureStringArray((data.Emotional_Triggers as any)?.Positive || (data['Emotional Triggers'] as any)?.Positive),
        negative: ensureStringArray((data.Emotional_Triggers as any)?.Negative || (data['Emotional Triggers'] as any)?.Negative),
        raw: transformEmotionalTriggersRawToStringArray((data.Emotional_Triggers as any)?.Raw || data.Emotional_Triggers || data['Emotional Triggers'])
      },
      regionalNuances: countryRegionalNuances,
      culturalContext: ensureString(data['Cultural Context'], undefined),
      presentation: countryPresentation,
      comparison: countryComparison
    };

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
    // Special handling for __src region (CSV data source)
    if (region === '__src') {
      return NextResponse.json({
        message: 'CSV data source region',
        note: 'This region contains source CSV files, not persona JSON files',
        availableFiles: [
          'global_ceo.csv',
          '2025_global_data.csv',
          'Korn Ferry open ends Senior Leader Survey April 2025(Textual Data).csv'
        ],
        csvEndpoint: '/api/data?file=<filename>',
        listEndpoint: 'POST /api/data'
      }, { status: 200 });
    }

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
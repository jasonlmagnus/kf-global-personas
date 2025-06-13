import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Persona, GlobalPersona, CountryPersona, GlobalPersonaV3, Region, Department, isGlobalPersonaV3 } from '@/types/personas';
import { formatDepartmentName } from '@/lib/personaUtils';
import fsPromises from 'fs/promises';

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
        if (typeof item === 'object' && item !== null && item.Trigger) {
            // Handle both "Emotional_Response" and "Emotional Response" (with space)
            const emotionalResponse = item.Emotional_Response || item["Emotional Response"];
            if (emotionalResponse) {
                let base = `${item.Trigger}: ${emotionalResponse}`;
                // Handle both "Messaging_Implication" and "Messaging Implication" (with space)
                const messagingImplication = item.Messaging_Implication || item["Messaging Implication"];
                if (messagingImplication) {
                    base += ` - Messaging: ${messagingImplication}`;
                }
                return base;
            }
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

// NEW Helper to robustly process fields into Record<string, string[]> for country personas
const ensureRecordStringArray = (fieldData: any): Record<string, string[]> => {
  // Case 1: Data is already a well-formed object of string arrays (the ideal format)
  if (typeof fieldData === 'object' && fieldData !== null && !Array.isArray(fieldData)) {
    // A simple validation to ensure values are arrays of strings
    Object.keys(fieldData).forEach(key => {
      if (!Array.isArray(fieldData[key])) {
        // If a value isn't an array, wrap it in one
        fieldData[key] = [String(fieldData[key])];
      } else {
        // Ensure all items in the array are strings
        fieldData[key] = fieldData[key].map(String);
      }
    });
    return fieldData as Record<string, string[]>;
  }
  // Case 2: Data is a flat array of strings
  if (Array.isArray(fieldData)) {
    // Convert to a record under a 'General' category
    return { 'General': fieldData.map(String) };
  }
  // Fallback for any other type
  return {};
};

// Convert raw data into a normalized Persona
function normalizePersonaData(data: PersonaJsonData | GlobalPersonaV3, region: Region, department: Department): Persona {
  // Check if data is already in v3 format
  if (isGlobalPersonaV3(data as Persona)) {
    const v3Data = data as GlobalPersonaV3;
    // Return v3 data, ensuring base properties are correctly typed and assigned
    return {
      ...v3Data,
      id: `${region}_${department}`,
      title: v3Data.title || `Global ${formatDepartmentName(department)}`, // Use existing title or generate one
      department,
      region,
      isGlobal: true,
      type: "global",
    };
  }
  
  // Cast to PersonaJsonData for v1 processing
  const jsonData = data as PersonaJsonData;
  
  const baseRole = (typeof jsonData['Role'] === 'string' && jsonData['Role'].trim() !== '') 
                   ? jsonData['Role'].trim() 
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
      id: `${region}_${department}`,
      title: globalTitle,
      department,
      region,
      isGlobal: true,
      type: "global",
      roleOverview: ensureString(jsonData.Core_Belief || jsonData.Role_Overview), // Using Core_Belief as placeholder, or Role_Overview if exists
      goalStatement: ensureString(jsonData['Goal Statement'] || jsonData['User Goal Statement'] || jsonData['User_Goal_Statement']),
      quote: ensureString(jsonData['Quote'] || jsonData['User Quote'], undefined), // ensureString can take undefined as fallback
      coreBelief: ensureString(jsonData['Core_Belief'] || jsonData['Core Belief'], undefined),
      keyRelationships: ensureStringArray(jsonData.Key_Relationships), // New field
      uniquePerspective: ensureString(jsonData.Unique_Perspective), // New field
      kpis: ensureStringArray(jsonData.KPIs), // New field
      
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
        raw: transformEmotionalTriggersRawToStringArray((jsonData.Emotional_Triggers as any)?.Raw || jsonData.Emotional_Triggers || jsonData['Emotional Triggers'])
      },
      perceptionGaps: Array.isArray(jsonData.Perception_Gaps) && jsonData.Perception_Gaps.every(item => typeof item === 'object' && item !==null) ? jsonData.Perception_Gaps as any : [],
      connectionOpportunities: Array.isArray(jsonData.Connection_Opportunities) && jsonData.Connection_Opportunities.every(item => typeof item === 'object' && item !==null) ? jsonData.Connection_Opportunities as any : [],
      analogies: processArrayField(jsonData.Analogies), 
      referenceSources: transformReferenceSourcesToStringArray(jsonData.Reference_Sources),
      problemSolvingMethod: ensureString(jsonData.Problem_Solving_Method, undefined) // Changed to ensureString for single string
    };
    return persona;

  } else { // Country Persona
    const countryTitle = `${formatRegionNameForTitle(region)} ${baseRole}`;

    const countryPainPointsKey = jsonData.Frustrations_Pain_Points ? 'Frustrations_Pain_Points' : 
                                (jsonData['Frustrations / Pain Points'] ? 'Frustrations / Pain Points' : 'Frustrations');

    // Use the new robust helper function for all relevant fields
    const countryNeeds = ensureRecordStringArray(jsonData.Needs);
    const countryMotivations = ensureRecordStringArray(jsonData.Motivations);
    const countryPainPoints = ensureRecordStringArray(jsonData[countryPainPointsKey!]);
    const countryKeyResponsibilities = ensureRecordStringArray(jsonData['Key Responsibilities'] || jsonData.Key_Responsibilities);
    const countryBehaviors = ensureRecordStringArray(jsonData.Behaviors);
    const countryCollaborationInsights = ensureRecordStringArray(jsonData['Collaboration Insights'] || jsonData.Collaboration_Insights);
    
    // For regionalNuances (e.g., Australian_Differentiation from JSON)
    const regionalNuancesData = jsonData['Regional Nuances'] || jsonData[`${region.toUpperCase()} Differentiation`] || jsonData['Australian_Differentiation'];
    const countryRegionalNuances: Record<string, string> = {};
    if (typeof regionalNuancesData === 'object' && regionalNuancesData !== null && !Array.isArray(regionalNuancesData)) {
        for (const [key, value] of Object.entries(regionalNuancesData)) {
            if (typeof value === 'string') {
                countryRegionalNuances[key] = value;
            }
        }
    }

    // For presentation guidance
    const presentationData = jsonData['Presentation Guidance'] || jsonData.Presentation_Guidance;
    const countryPresentation: Record<string, string> = {};
    if (typeof presentationData === 'object' && presentationData !== null && !Array.isArray(presentationData)) {
        for (const [key, value] of Object.entries(presentationData)) {
            if (typeof value === 'string') {
                countryPresentation[key] = value;
            }
        }
    }
    
    // For comparison data - dynamic handling for any country
    const comparisonData = jsonData['Comparison to Generic CEO'] || jsonData.Comparison_to_Generic_CEO;
    // Define the expected type for a comparison item (using generic Record for dynamic field names)
    type ComparisonItem = Record<string, string>;
    let countryComparison: Array<ComparisonItem> = [];
    if (Array.isArray(comparisonData)) {
        countryComparison = comparisonData.filter(item => 
            typeof item === 'object' && item !== null &&
            typeof item["Key Dimension"] === 'string' &&
            typeof item["Generic CEO Persona"] === 'string' &&
            // Check for any field that contains "CEO Persona" but isn't "Generic"
            Object.keys(item).some(key => key.includes("CEO Persona") && !key.includes("Generic")) &&
            // Check for any field that contains "Value-Add"
            Object.keys(item).some(key => key.includes("Value-Add"))
        ) as Array<ComparisonItem>;
    }

    const persona: CountryPersona = {
      id: `${region}_${department}`,
      title: countryTitle,
      department,
      region,
      isGlobal: false,
      type: "country",
      userGoalStatement: ensureString(jsonData['User Goal Statement'] || jsonData.User_Goal_Statement),
      quote: ensureString(jsonData['User Quote'], undefined),
      needs: countryNeeds,
      motivations: countryMotivations,
      painPoints: countryPainPoints,
      keyResponsibilities: countryKeyResponsibilities,
      behaviors: countryBehaviors,
      collaborationInsights: countryCollaborationInsights,
      emotionalTriggers: {
        positive: ensureStringArray((jsonData.Emotional_Triggers as any)?.Positive || (jsonData['Emotional Triggers'] as any)?.Positive),
        negative: ensureStringArray((jsonData.Emotional_Triggers as any)?.Negative || (jsonData['Emotional Triggers'] as any)?.Negative),
        raw: transformEmotionalTriggersRawToStringArray((jsonData.Emotional_Triggers as any)?.Raw || jsonData.Emotional_Triggers || jsonData['Emotional Triggers'])
      },
      regionalNuances: countryRegionalNuances,
      culturalContext: ensureString(jsonData['Cultural Context'], undefined),
      presentation: countryPresentation,
      comparison: countryComparison
    };

    return persona;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') as Region | null;
  const department = searchParams.get('department') as Department | null;
  const dataDirectory = path.join(process.cwd(), 'public', 'data');

  try {
    // If both region and department are specified, return a single specific persona
    if (region && department) {
      const filename = `${region}_${department}.json`;
      const filePath = path.join(dataDirectory, filename);

      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Persona not found' }, { status: 404 });
      }

      const jsonData = readJsonFile(filePath);
      if (!jsonData) {
        return NextResponse.json({ error: `Error reading persona data from ${filename}` }, { status: 500 });
      }

      const persona = normalizePersonaData(jsonData, region, department);
      return NextResponse.json(persona);
    }

    // If no params are given, return all personas
    const files = await fsPromises.readdir(dataDirectory);
    const personaFiles = files.filter(file => file.endsWith('.json'));

    const personas: Persona[] = [];
    for (const file of personaFiles) {
      const id = file.replace('.json', '');
      const filePath = path.join(dataDirectory, file);
      const jsonData = readJsonFile(filePath);
      if (jsonData) {
        const idParts = id.split('_');
        const fileRegion = idParts[0] as Region;
        const fileDepartment = idParts.slice(1).join('_') as Department;
        if (fileRegion && fileDepartment) {
          personas.push(normalizePersonaData(jsonData, fileRegion, fileDepartment));
        }
      }
    }
    return NextResponse.json(personas);

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
// Region types
export type Region = 'global' | 'uk' | 'uae' | 'aus';

// Department/role types
export type Department = 'ceo' | 'chro' | 'sales' | 'talent' | 'rewards' | 'leadership_dev';

// Base persona interface with common fields
export interface BasePersona {
  id: string;
  title: string;
  department: Department;
  region: Region;
}

// Global persona specific fields
export interface GlobalPersona extends BasePersona {
  isGlobal: true;
  type: "global";
  roleOverview?: string;
  goalStatement: string;
  quote?: string;
  coreBelief?: string;
  keyRelationships?: string[];
  uniquePerspective?: string;
  kpis?: string[];
  needs: Array<{ Category: string; Description: string }>;
  motivations: string[];
  keyResponsibilities: Array<{ Category: string; Description: string }>;
  knowledgeOrExpertise?: string[];
  typicalChallenges?: string[];
  currentProjects?: string[];
  painPoints?: string[];
  behaviors?: string[];
  collaborationInsights?: string[];
  emotionalTriggers?: {
    positive: string[];
    negative: string[];
    raw?: string[];
  };
  perceptionGaps?: Array<{
    Area: string;
    Gap: string;
    Business_Impact: string;
    Opportunity: string;
  }>;
  connectionOpportunities?: Array<{
    Area: string;
    Finding: string;
    Leverage_Point: string;
  }>;
  analogies?: string[];
  referenceSources?: string[];
  problemSolvingMethod?: string;
}

// Country-specific persona fields
export interface CountryPersona extends BasePersona {
  isGlobal: false;
  userGoalStatement: string;
  quote?: string;
  needs: Record<string, string[]>;
  motivations: Record<string, string[]>;
  painPoints: Record<string, string[]>;
  emotionalTriggers?: {
    positive: string[];
    negative: string[];
    raw?: string[];
  };
  regionalNuances?: Record<string, string>;
  culturalContext?: string;
  presentation?: Record<string, string>;
  comparison?: Array<{
    "Key Dimension": string;
    "Generic CEO Persona": string;
    "Australian CEO Persona": string;
    "Value-Add for Australian Context": string;
  }>;
  behaviors?: Record<string, string[]>;
  keyResponsibilities?: Record<string, string[]>;
  collaborationInsights?: Record<string, string[]>;
  type: "country";
}

// Union type for all persona types
export type Persona = GlobalPersona | CountryPersona;

// Type guard to check if a persona is global
export function isGlobalPersona(persona: Persona): persona is GlobalPersona {
  return persona.type === "global";
}

// Type guard to check if a persona is country-specific
export function isCountryPersona(persona: Persona): persona is CountryPersona {
  return persona.type === "country";
}

// Added ConfigItem interface
export interface ConfigItem {
  id: string;
  name: string;
} 
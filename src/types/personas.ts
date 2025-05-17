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
  goalStatement: string;
  quote?: string;
  coreBelief?: string;
  needs: string[];
  motivations: string[];
  keyResponsibilities: string[];
  knowledgeOrExpertise?: string[];
  typicalChallenges?: string[];
  currentProjects?: string[];
  painPoints?: string[];
  behaviors?: string[];
  collaborationInsights?: string[];
  emotionalTriggers?: {
    positive: string[];
    negative: string[];
    raw?: any[];
  };
}

// Country-specific persona fields
export interface CountryPersona extends BasePersona {
  isGlobal: false;
  userGoalStatement: string;
  quote?: string;
  needs: string[];
  motivations: string[];
  painPoints: string[];
  emotionalTriggers?: {
    positive: string[];
    negative: string[];
    raw?: any[]; // For array of emotional trigger objects
  };
  regionalNuances?: string[];
  culturalContext?: string;
  behaviors?: string[];
  keyResponsibilities?: string[];
  collaborationInsights?: string[];
  presentation?: any; // Presentation guidance
  comparison?: any[]; // Comparison data
}

// Union type for all persona types
export type Persona = GlobalPersona | CountryPersona;

// Type guard to check if a persona is global
export function isGlobalPersona(persona: Persona): persona is GlobalPersona {
  return persona.isGlobal === true;
}

// Type guard to check if a persona is country-specific
export function isCountryPersona(persona: Persona): persona is CountryPersona {
  return persona.isGlobal === false;
} 
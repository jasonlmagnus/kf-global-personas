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
  comparison?: Array<Record<string, string>>;
  behaviors?: Record<string, string[]>;
  keyResponsibilities?: Record<string, string[]>;
  collaborationInsights?: Record<string, string[]>;
  type: "country";
}

// Global persona v3 structure (hierarchical)
export interface GlobalPersonaV3 extends BasePersona {
  isGlobal: true;
  type: "global";
  
  metadata: {
    version: string;
    type: string;
    lastUpdated: string;
  };
  coreUnderstanding: {
    core: {
      role: string;
      userGoalStatement: string;
      coreBelief: string;
      contentImplication: string;
    };
    responsibilities: {
      items: Array<{ Category: string; Description: string }>;
      contentImplication: string;
    };
    knowledge: {
      items: string[];
      contentImplication: string;
    };
  };
  strategicValuePoints: {
    connectionOpportunities: {
      items: Array<{
        Area: string;
        Finding: string;
        Leverage_Point: string;
        dataSource?: string;
      }>;
      contentImplication: string;
    };
    motivations: {
      items: string[];
      contentImplication: string;
    };
    needs: {
      items: Array<{ Category: string; Description: string }>;
      contentImplication: string;
    };
  };
  painPointsAndChallenges: {
    perceptionGaps: {
      items: Array<{
        Area: string;
        Gap: string;
        Business_Impact: string;
        Opportunity: string;
        dataSource?: string;
      }>;
      contentImplication: string;
    };
    frustrations: {
      items: string[];
      contentImplication: string;
    };
    emotionalTriggers: {
      items: Array<{
        Trigger: string;
        Emotional_Response: string;
        Messaging_Implication: string;
      }>;
      contentImplication: string;
    };
  };
  engagementApproach: {
    description: string;
    behaviors: {
      items: string[];
      contentImplication: string;
    };
    collaborationInsights: {
      items: string[];
      contentImplication: string;
    };
    problemSolvingMethod: {
      description: string;
      value: string;
    };
    analogies: {
      items: string[];
      contentImplication: string;
    };
    messagingAngles: {
      description: string;
      items: string[];
      contentImplication: string;
    };
  };
  supportingResources: {
    referenceSources: Array<{
      Category: string;
      Sources: string[];
      URLs?: string[];
    }>;
  };
}

// Union type for all persona types
export type Persona = GlobalPersona | CountryPersona | GlobalPersonaV3;

// Type guard to check if a persona is global v3
export function isGlobalPersonaV3(persona: Persona): persona is GlobalPersonaV3 {
  return 'metadata' in persona && 
         persona.metadata?.type === 'global' && 
         'coreUnderstanding' in persona;
}

// Type guard to check if a persona is global v1
export function isGlobalPersona(persona: Persona): persona is GlobalPersona {
  return 'type' in persona && 
         persona.type === "global" && 
         !('metadata' in persona) && 
         'goalStatement' in persona;
}

// Type guard to check if a persona is country-specific
export function isCountryPersona(persona: Persona): persona is CountryPersona {
  return 'type' in persona && persona.type === "country";
}

// Added ConfigItem interface
export interface ConfigItem {
  id: string;
  name: string;
} 
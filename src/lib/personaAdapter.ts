import { Persona, GlobalPersona, CountryPersona, Region, Department } from '../types/personas';

// API paths for fetching persona data
const API_PATHS = {
  ALL: '/api/personas',
  BY_REGION: (region: Region) => `/api/personas?region=${region}`,
  SPECIFIC: (region: Region, department: Department) => `/api/personas?region=${region}&department=${department}`,
};

/**
 * Get available regions from the system
 * @returns Array of available regions
 */
export async function getAvailableRegions(): Promise<Region[]> {
  return ['global', 'uk', 'uae', 'aus'];
}

/**
 * Get available departments for a specific region
 * @param region The region to get departments for
 * @returns Array of available departments
 */
export async function getAvailableDepartments(region: Region): Promise<Department[]> {
  return ['ceo', 'chro', 'sales', 'talent', 'rewards', 'leadership_dev'];
}

/**
 * Fetch a specific persona by region and department
 * @param region The region of the persona
 * @param department The department/role of the persona
 * @returns The persona data or null if not found
 */
export async function getPersona(region: Region, department: Department): Promise<Persona | null> {
  try {
    const response = await fetch(API_PATHS.SPECIFIC(region, department));
    if (!response.ok) {
      console.error(`Error fetching persona: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching persona for ${region}/${department}:`, error);
    return null;
  }
}

/**
 * Fetch all personas for a specific region
 * @param region The region to fetch personas for
 * @returns Array of personas for the region
 */
export async function getPersonasByRegion(region: Region): Promise<Persona[]> {
  try {
    const response = await fetch(API_PATHS.BY_REGION(region));
    if (!response.ok) {
      console.error(`Error fetching region personas: ${response.statusText}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching personas for region ${region}:`, error);
    return [];
  }
}

/**
 * Fetch all personas from all regions
 * @returns Array of all personas
 */
export async function getAllPersonas(): Promise<Persona[]> {
  try {
    const response = await fetch(API_PATHS.ALL);
    if (!response.ok) {
      console.error(`Error fetching all personas: ${response.statusText}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all personas:', error);
    return [];
  }
}

/**
 * Compare two personas and identify similarities and differences
 * @param personaA First persona to compare
 * @param personaB Second persona to compare
 * @returns Object containing similar and different attributes
 */
export function comparePersonas(personaA: Persona, personaB: Persona) {
  // Common properties to all personas
  const commonKeys = ['title', 'department', 'needs', 'motivations', 'quote'];
  
  // Build comparison result
  return {
    common: {
      // Basic info both personas share
      basicInfo: {
        title: personaA.title === personaB.title,
        department: personaA.department === personaB.department,
        quote: personaA.quote === personaB.quote,
      },
      // Compare arrays for overlap
      needs: personaA.needs.filter(need => 
        personaB.needs.includes(need)
      ),
      motivations: personaA.motivations.filter(motivation => 
        personaB.motivations.includes(motivation)
      ),
    },
    differences: {
      // Highlight differences in region and type
      region: personaA.region !== personaB.region,
      isGlobal: personaA.isGlobal !== personaB.isGlobal,
      // Unique needs and motivations
      uniqueNeeds: {
        [personaA.region]: personaA.needs.filter(need => 
          !personaB.needs.includes(need)
        ),
        [personaB.region]: personaB.needs.filter(need => 
          !personaA.needs.includes(need)
        ),
      },
      uniqueMotivations: {
        [personaA.region]: personaA.motivations.filter(motivation => 
          !personaB.motivations.includes(motivation)
        ),
        [personaB.region]: personaB.motivations.filter(motivation => 
          !personaA.motivations.includes(motivation)
        ),
      },
    }
  };
} 
import { Persona, GlobalPersona, CountryPersona, Region, Department } from '../types/personas';

// Helper function to get the base URL for API calls
function getBaseUrl(): string {
  // During build time (static generation), use localhost
  if (typeof window === 'undefined') {
    return process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL 
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'http://localhost:3000';
  }
  // Client-side, use relative URLs
  return '';
}

// API paths for fetching persona data
const API_PATHS = {
  ALL: '/api/personas',
  BY_REGION: (region: Region) => `/api/personas?region=${region}`,
  SPECIFIC: (region: Region, department: Department) => `/api/personas?region=${region}&department=${department}`,
};

// Helper to construct full URLs
function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

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
    const response = await fetch(getFullUrl(API_PATHS.SPECIFIC(region, department)));
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
    const response = await fetch(getFullUrl(API_PATHS.BY_REGION(region)));
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
    const response = await fetch(getFullUrl(API_PATHS.ALL));
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

  const needsA = (personaA as any).needs ?? [];
  const needsB = (personaB as any).needs ?? [];
  const motivationsA = (personaA as any).motivations ?? [];
  const motivationsB = (personaB as any).motivations ?? [];
  
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
      needs: needsA.filter((need: any) => needsB.includes(need)),
      motivations: motivationsA.filter((m: any) => motivationsB.includes(m)),
    },
    differences: {
      // Highlight differences in region and type
      region: personaA.region !== personaB.region,
      isGlobal: personaA.isGlobal !== personaB.isGlobal,
      // Unique needs and motivations
      uniqueNeeds: {
        [personaA.region]: needsA.filter((need: any) => !needsB.includes(need)),
        [personaB.region]: needsB.filter((need: any) => !needsA.includes(need)),
      },
      uniqueMotivations: {
        [personaA.region]: motivationsA.filter((m: any) => !motivationsB.includes(m)),
        [personaB.region]: motivationsB.filter((m: any) => !motivationsA.includes(m)),
      },
    }
  };
} 
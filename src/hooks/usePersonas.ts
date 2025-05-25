"use client";

import { useState, useEffect } from 'react';
import { Persona, Region, Department, ConfigItem } from '../types/personas';
import { getPersona, getPersonasByRegion, getAllPersonas } from '../lib/personaAdapter';

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

// Helper to construct full URLs
function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

// API paths for fetching persona data (for future implementation)
const API_PATHS = {
  ALL: '/api/personas',
  BY_REGION: (region: Region) => `/api/personas?region=${region}`,
  SPECIFIC: (region: Region, department: Department) => `/api/personas?region=${region}&department=${department}`,
};

/**
 * Hook for loading all personas
 */
export function useAllPersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadPersonas() {
      try {
        setLoading(true);
        setError(null);
        
        // Use the adapter to fetch all personas
        const allPersonas = await getAllPersonas();
        
        if (isMounted) {
          setPersonas(allPersonas);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading personas:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load personas');
          setLoading(false);
        }
      }
    }

    loadPersonas();
    
    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, []);

  return { personas, loading, error };
}

/**
 * Hook for loading personas by region
 */
export function usePersonasByRegion(region: Region | null) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPersonas() {
      if (!region) {
        if (isMounted) {
          setPersonas([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Use the adapter to fetch personas for a region
        const regionPersonas = await getPersonasByRegion(region);
        
        if (isMounted) {
          setPersonas(regionPersonas);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading personas for region ${region}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load personas');
          setLoading(false);
        }
      }
    }

    loadPersonas();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [region]);

  return { personas, loading, error };
}

/**
 * Hook for loading a specific persona
 */
export function usePersona(region: Region | null, department: Department | null) {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadPersona() {
      // Ensure region and department are provided before fetching
      if (!region || !department) {
        if (isMounted) {
          setPersona(null);
          setLoading(false); // Don't show loading if selection is incomplete
          setError(null); // Clear any previous error
        }
        return;
      }

      setLoading(true); // Set loading to true only when we are actually fetching
      setError(null);
      try {
        // Use the adapter to fetch a specific persona
        const personaData = await getPersona(region, department);
        
        if (isMounted) {
          if (personaData) {
            setPersona(personaData);
          } else {
            throw new Error(`Persona not found for ${region}/${department}`);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading persona for ${region}/${department}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load persona');
          setLoading(false);
        }
      }
    }

    loadPersona();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [region, department]);

  return { persona, loading, error };
}

/**
 * Hook for loading personas for a specific role across all available regions.
 */
export function useRolePersonas(selectedDepartment: Department | null, dynamicRegions: ConfigItem[]) {
  const [rolePersonas, setRolePersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false); // Initially not loading until department and regions are present
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDepartment || !dynamicRegions || dynamicRegions.length === 0) {
      setRolePersonas([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    const fetchRolePersonasData = async () => {
      if (!isMounted) return;
      setLoading(true);
      setError(null);

      try {
        const regionsToFetch = dynamicRegions.map((r) => r.id as Region);
        const personas: Persona[] = [];

        const fetchPromises = regionsToFetch.map((region) =>
          fetch(
            getFullUrl(`/api/personas?region=${region}&department=${selectedDepartment}`)
          )
            .then((res) => {
              if (!res.ok) {
                // If response is not OK, but parsable JSON error, use it
                return res.json().then(errData => {
                  throw new Error(errData.error || `Failed to fetch ${region}/${selectedDepartment} persona (${res.status})`);
                }).catch(() => {
                  // If not parsable JSON, throw generic error
                  throw new Error(`Failed to fetch ${region}/${selectedDepartment} persona (${res.status})`);
                });
              }
              return res.json();
            })
            .then((data) => {
              if (data && !data.error) { // Ensure data is valid and not an error object from API
                personas.push(data);
              } else if (data && data.error) {
                console.warn(`API error for ${region}/${selectedDepartment}: ${data.error}`);
                // Optionally, collect these errors to show to the user
              }
            })
            .catch((err) =>
              console.error(
                `Error fetching or processing ${region}/${selectedDepartment} persona:`, err
              )
            )
        );

        await Promise.all(fetchPromises);
        if (isMounted) {
          const filteredPersonas = personas.filter(Boolean);
          setRolePersonas(filteredPersonas);
        }
      } catch (error) {
        console.error("Error fetching role personas:", error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Failed to load role personas");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRolePersonasData();

    return () => {
      isMounted = false;
    };
  }, [selectedDepartment, dynamicRegions]); // Dependency on dynamicRegions stringified might be better if it's complex

  return { rolePersonas, loading, error };
} 
"use client";

import { useState, useEffect } from 'react';
import { Persona, Region, Department } from '../types/personas';
import { getPersona, getPersonasByRegion, getAllPersonas } from '../lib/personaAdapter';

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
export function usePersonasByRegion(region: Region) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadPersonas() {
      try {
        setLoading(true);
        setError(null);
        
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
export function usePersona(region: Region, department: Department) {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadPersona() {
      // Ensure region and department are provided before fetching
      if (!region || !department) {
        if (isMounted) {
          // setError('Region and Department must be selected to fetch a persona.'); // Or handle silently
          setPersona(null);
          setLoading(false); // Don't show loading if selection is incomplete
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
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
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronDown } from "lucide-react";
import DetailedPersonaCard from "@/components/personas/DetailedPersonaCard";
import PersonaSummaryCard from "@/components/personas/PersonaSummaryCard";
import { Persona, Department } from "@/types/personas"; // Using the correct Persona type

// Selector component, adapted from PersonaSelector.tsx
const PersonaSelector = ({
  roles,
  regions,
  selectedRole,
  setSelectedRole,
  selectedRegion,
  setSelectedRegion,
}) => (
  <div className="p-4 md:p-6 bg-white rounded-lg shadow-md mb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="filter-item">
        <label className="text-sm font-medium text-gray-600 mb-1 block">
          Role
        </label>
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-md appearance-none"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="filter-item">
        <label className="text-sm font-medium text-gray-600 mb-1 block">
          Region
        </label>
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-md appearance-none"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
);

function PersonasPageContent() {
  const { theme, isLoading: isThemeLoading } = useTheme();
  const [allPersonas, setAllPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [personaForDetail, setPersonaForDetail] = useState<Persona | null>(
    null
  );

  // State for filters
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Memoized lists for selectors
  const availableRoles = useMemo(() => {
    const roles = new Set(allPersonas.map((p) => p.department));
    return Array.from(roles).sort();
  }, [allPersonas]);

  const availableRegions = useMemo(() => {
    const regions = new Set(allPersonas.map((p) => p.region));
    return Array.from(regions).sort();
  }, [allPersonas]);

  // Fetch all personas on mount
  useEffect(() => {
    const fetchAllPersonas = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/personas");
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        const personas: Persona[] = await response.json();
        setAllPersonas(personas);
      } catch (error) {
        console.error("Failed to fetch personas", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllPersonas();
  }, []);

  // Filtered personas based on selection
  const filteredPersonas = useMemo(() => {
    return allPersonas.filter((p) => {
      const roleMatch = selectedRole === "all" || p.department === selectedRole;
      const regionMatch =
        selectedRegion === "all" || p.region === selectedRegion;
      return roleMatch && regionMatch;
    });
  }, [allPersonas, selectedRole, selectedRegion]);

  // When filters change, if we were viewing a detailed persona that is NO LONGER in the filtered list,
  // we should go back to the list view.
  useEffect(() => {
    if (
      personaForDetail &&
      !filteredPersonas.find((p) => p.id === personaForDetail.id)
    ) {
      setPersonaForDetail(null);
    }
  }, [filteredPersonas, personaForDetail]);

  const handleSelectPersona = (persona: Persona) => {
    setPersonaForDetail(persona);
  };

  const handleReturnToList = () => {
    setPersonaForDetail(null);
  };

  if (isThemeLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className="p-4 md:p-8"
      style={{ fontFamily: theme?.typography.fontFamily }}
    >
      <h1
        className="text-4xl font-bold mb-8"
        style={{ color: theme?.colors.primary }}
      >
        Personas
      </h1>

      <PersonaSelector
        roles={availableRoles}
        regions={availableRegions}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />

      {personaForDetail ? (
        <div>
          <button
            onClick={handleReturnToList}
            className="inline-flex items-center mb-6 text-blue-600 font-semibold hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to List
          </button>
          <DetailedPersonaCard persona={personaForDetail} />
        </div>
      ) : (
        <>
          {filteredPersonas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPersonas.map((p) => (
                <PersonaSummaryCard
                  key={p.id}
                  persona={p}
                  onSelect={handleSelectPersona}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">No Personas Found</h3>
              <p>Please adjust your role and region filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PersonasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonasPageContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronDown } from "lucide-react";
import DetailedPersonaCard from "@/components/personas/DetailedPersonaCard";
import PersonaSummaryCard from "@/components/personas/PersonaSummaryCard";
import { Persona } from "@/types/personas";

// Inline the selector component again for simplicity
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
  // Removed session logic
  const [allPersonas, setAllPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [personaForDetail, setPersonaForDetail] = useState<Persona | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Reverted fetching logic
  useEffect(() => {
    const fetchAllPersonas = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/personas"); // Simple fetch
        if (!response.ok) throw new Error("API call failed");
        const data = await response.json();
        setAllPersonas(data.personas || []);
      } catch (error) {
        console.error("Failed to fetch personas", error);
        setAllPersonas([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllPersonas();
  }, []);

  // Memoized lists for selectors
  const availableRoles = useMemo(() => {
    const roles = new Set(allPersonas.map((p) => p.department));
    return Array.from(roles).sort();
  }, [allPersonas]);

  const availableRegions = useMemo(() => {
    const regions = new Set(allPersonas.map((p) => p.region));
    return Array.from(regions).sort();
  }, [allPersonas]);

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

  const handleDeletePersona = async (personaToDelete: Persona) => {
    try {
      const response = await fetch("/api/personas/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Reverted to simple payload
          region: personaToDelete.region,
          department: personaToDelete.department,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete persona.");
      }

      // On successful deletion, update the state
      setAllPersonas((prevPersonas) =>
        prevPersonas.filter((p) => p.id !== personaToDelete.id)
      );
      // If the deleted persona was the one being viewed in detail, return to list
      if (personaForDetail?.id === personaToDelete.id) {
        setPersonaForDetail(null);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";
      // In a real app, you'd show a toast notification here
      alert(`Error deleting persona: ${message}`);
      console.error("Error deleting persona:", error);
    }
  };

  if (isThemeLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
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

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : personaForDetail ? (
        <div>
          <button
            onClick={handleReturnToList}
            className="inline-flex items-center mb-6 text-primary font-semibold hover:underline"
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
                  onDelete={handleDeletePersona}
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

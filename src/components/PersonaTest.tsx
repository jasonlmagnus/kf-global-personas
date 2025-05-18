"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Region,
  Department,
  Persona,
  isGlobalPersona,
  ConfigItem,
} from "../types/personas";
import {
  usePersona,
  usePersonasByRegion,
  useRolePersonas,
} from "../hooks/usePersonas";
// Removed unused lucide-react icons

// import { generatePersonaDocument } from "@/lib/docGenerator"; // To be removed
// import PersonaDetailsContent from "./personas/PersonaDetailsContent"; // To be removed
import DetailedPersonaCard from "./personas/DetailedPersonaCard";
import {
  shouldHideRegionCode,
  getRoleImage,
  getRegionBackground,
  getRoleCardTitle,
  formatDepartmentName,
} from "../lib/personaUtils";
// import HeaderBanner from "./personas/HeaderBanner"; // Removed import
import PersonaSelector from "./personas/PersonaSelector";
import PersonaList from "./personas/PersonaList";
// import PersonaDetailView from "./personas/PersonaDetailView"; // REMOVE MODAL IMPORT

// Hardcoded for initial testing - REMOVE/COMMENT OUT
// const availableRegions: Region[] = ["uk", "uae", "aus"];
// const availableDepartments: Department[] = [
//   "ceo",
//   "chro",
//   "sales",
//   "talent",
//   "rewards",
//   "leadership_dev",
// ];

// DetailedPersonaCard component definition is removed from here if it exists.

/**
 * A component for testing and understanding the persona data structure
 */
export function PersonaTest() {
  // Change default region to 'global' instead of 'uk'
  const [selectedRegion, setSelectedRegion] = useState<Region | null>("global");
  // Add state to store previous region when switching to role view
  const [savedRegion, setSavedRegion] = useState<Region | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>("ceo");
  // Add state to store previous department when switching to region view
  const [savedDepartment, setSavedDepartment] = useState<Department | null>(
    null
  );
  const [comparedRegion, setComparedRegion] = useState<Region | null>(null);
  const [viewType, setViewType] = useState<"single" | "role" | "region">(
    "single"
  );

  // Add state for dynamic config data
  const [dynamicRegions, setDynamicRegions] = useState<ConfigItem[]>([]);
  const [dynamicDepartments, setDynamicDepartments] = useState<ConfigItem[]>(
    []
  );
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  // Use the new useRolePersonas hook
  const {
    rolePersonas,
    loading: rolePersonasLoading,
    error: rolePersonasError,
  } = useRolePersonas(selectedDepartment, dynamicRegions);

  // Sort rolePersonas: Global first, then by region name alphabetically
  const sortedRolePersonas = useMemo(() => {
    if (!rolePersonas) return [];
    return [...rolePersonas].sort((a, b) => {
      if (isGlobalPersona(a) && !isGlobalPersona(b)) return -1;
      if (!isGlobalPersona(a) && isGlobalPersona(b)) return 1;
      // If both are global or both are country, sort by region name.
      // For country personas, this sorts them by their specific region code.
      if (a.region && b.region) {
        // Explicitly handle if one is 'global' when both are passed (should be rare for two globals)
        if (a.region === "global" && b.region !== "global") return -1;
        if (a.region !== "global" && b.region === "global") return 1;
        return a.region.localeCompare(b.region);
      }
      // Fallback to title sort if region property is not available or for identical regions (e.g. two globals)
      return a.title.localeCompare(b.title);
    });
  }, [rolePersonas]);

  // Add this new state for the selected persona in modal view
  const [selectedDetailPersona, setSelectedDetailPersona] =
    useState<Persona | null>(null);

  // Add effect to handle viewType changes and region/department selection
  useEffect(() => {
    if (viewType === "role") {
      // When switching to role view, save current region
      setSavedRegion(selectedRegion);
    } else if (
      savedRegion &&
      (viewType === "single" || viewType === "region")
    ) {
      // When switching away from role view, restore saved region
      setSelectedRegion(savedRegion);
    }

    if (viewType === "region") {
      // When switching to region view, save current department
      setSavedDepartment(selectedDepartment);
    } else if (
      savedDepartment &&
      (viewType === "single" || viewType === "role")
    ) {
      // When switching away from region view, restore saved department
      setSelectedDepartment(savedDepartment);
    }
  }, [
    viewType,
    savedRegion,
    savedDepartment,
    selectedRegion,
    selectedDepartment,
  ]);

  // Use our custom hooks
  const {
    persona,
    loading: personaLoading,
    error: personaError,
  } = usePersona(selectedRegion, selectedDepartment);

  const {
    personas: regionPersonas,
    loading: regionLoading,
    error: regionError,
  } = usePersonasByRegion(selectedRegion);

  const {
    persona: comparedPersona,
    loading: compareLoading,
    error: compareError,
  } = usePersona(comparedRegion, selectedDepartment);

  // Set up the comparison when needed
  useEffect(() => {
    if (viewType === "role") {
      // For Role Personas view, we'll compare across all regions
      setComparedRegion(selectedRegion === "uk" ? "uae" : "uk");
    } else {
      setComparedRegion(null);
    }
  }, [viewType, selectedRegion]);

  // Update effect for setting a default selected persona when data loads or view changes.
  useEffect(() => {
    if (viewType === "region" && regionPersonas && regionPersonas.length > 0) {
      setSelectedDetailPersona(regionPersonas[0]);
    } else if (
      viewType === "role" &&
      sortedRolePersonas &&
      sortedRolePersonas.length > 0
    ) {
      // Attempt to find and set the Global version of the current role by default
      const globalVersionOfRole = sortedRolePersonas.find(
        (p) => p.region === "global" && p.department === selectedDepartment
      );
      if (globalVersionOfRole) {
        setSelectedDetailPersona(globalVersionOfRole);
      } else {
        // Fallback to the first persona in the list if no specific global version is found
        setSelectedDetailPersona(sortedRolePersonas[0]);
      }
    } else if (viewType === "single" && persona) {
      setSelectedDetailPersona(persona); // For single view, display the loaded persona
    } else {
      // If no conditions are met (e.g., data still loading, or empty lists),
      // clear the selection. This might be too aggressive if merely switching viewType.
      // The separate effect for viewType change handles clearing more explicitly.
      // setSelectedDetailPersona(null);
    }
  }, [
    viewType,
    regionPersonas,
    sortedRolePersonas,
    persona,
    selectedDepartment,
  ]);

  // Add an effect to handle viewType changes directly
  useEffect(() => {
    // Clear selection when switching TO a different view type,
    // but allow the above effect to set a default FOR the new viewType.
    // This effect now primarily handles cleanup when switching AWAY from a view that had a selection.
    if (viewType !== "role") {
      // If switching away from role, or to single/region, allow specific defaults
      // For single view, the main persona hook will load it into 'persona', then above effect sets it.
      // For region view, the above effect sets the first regional persona.
    }
    // The primary clearing of selectedDetailPersona will now be managed by the above effect if data isn't ready.
    // setSelectedDetailPersona(null); // Commenting this out to give priority to the specific default setting logic.
  }, [viewType]);

  // Determine the overall loading and error states
  const loading =
    personaLoading ||
    (regionLoading && viewType === "region") ||
    (rolePersonasLoading && viewType === "role");

  const error =
    personaError ||
    (regionError && viewType === "region") ||
    (rolePersonasError && viewType === "role");

  // Add a function to handle card clicks
  const handlePersonaCardClick = (persona: Persona) => {
    setSelectedDetailPersona(persona);
  };

  // Fetch config data
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      setConfigError(null);
      try {
        const response = await fetch("/api/config");
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        const configData = await response.json();
        setDynamicRegions(configData.regions || []);
        setDynamicDepartments(configData.departments || []);

        // Initialize selectedRegion and selectedDepartment if lists are not empty
        // and current selections are not part of the dynamic lists or if they are null/undefined.
        // This part handles setting initial valid selections after config loads.
        if (configData.regions && configData.regions.length > 0) {
          const currentSelectedRegionIsValid = configData.regions.some(
            (r: ConfigItem) => r.id === selectedRegion
          );
          if (!currentSelectedRegionIsValid || !selectedRegion) {
            // Default to global if available, else first in list, or keep current if valid
            const globalRegion = configData.regions.find(
              (r: ConfigItem) => r.id === "global"
            );
            setSelectedRegion(
              (globalRegion
                ? globalRegion.id
                : configData.regions[0].id) as Region
            );
          }
        } else {
          setSelectedRegion(null); // Clear if no regions from config
        }

        if (configData.departments && configData.departments.length > 0) {
          const currentSelectedDeptIsValid = configData.departments.some(
            (d: ConfigItem) => d.id === selectedDepartment
          );
          if (!currentSelectedDeptIsValid || !selectedDepartment) {
            setSelectedDepartment(configData.departments[0].id as Department);
          }
        } else {
          setSelectedDepartment(null); // Clear if no departments from config
        }
      } catch (error) {
        console.error("Error fetching config:", error);
        setConfigError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="kf-personas-container bg-gray-100 min-h-screen">
      {/* Header - REMOVED */}
      {/* <header className="bg-[#003C2D] text-white p-6 shadow-md"> */}
      {/*   <div className="max-w-7xl mx-auto"> */}
      {/*     <h1 className="text-2xl font-bold">Korn Ferry Global Personas</h1> */}
      {/*   </div> */}
      {/* </header> */}
      {/* <HeaderBanner /> */} {/* Removed usage */}
      {/* Filters */}
      <PersonaSelector
        viewType={viewType}
        setViewType={setViewType}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        dynamicDepartments={dynamicDepartments}
        dynamicRegions={dynamicRegions}
        isLoadingConfig={isLoadingConfig}
      />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A523E]"></div>
          </div>
        )}

        {/* Display persona - Single view - UPDATED TO USE selectedDetailPersona */}
        {!loading &&
          selectedDetailPersona &&
          !error &&
          viewType === "single" && (
            <div className="mx-4">
              <DetailedPersonaCard
                persona={selectedDetailPersona}
                showCloseButton={false}
              />
            </div>
          )}

        {/* Role Personas view - UPDATED */}
        {!loading && !error && viewType === "role" && (
          <div className="mx-4">
            <h2 className="personas-header text-2xl font-bold mb-6 flex items-center justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <div style={{ width: "12px" }}></div>
              <span>Role Personas</span>
            </h2>
            {rolePersonasLoading ? (
              <p>Loading role personas...</p>
            ) : rolePersonasError ? (
              <p>Error: {rolePersonasError}</p>
            ) : (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {selectedDepartment
                    ? `${formatDepartmentName(
                        selectedDepartment
                      )} Personas by Region`
                    : "Role Personas by Region"}
                </h3>
                <PersonaList
                  personas={sortedRolePersonas}
                  viewType={viewType}
                  onPersonaClick={handlePersonaCardClick}
                  selectedDetailPersonaId={selectedDetailPersona?.id}
                />
              </div>
            )}
            {/* Inline DetailedPersonaCard for Role View if a persona is selected */}
            {selectedDetailPersona && (
              <div className="mt-8">
                <DetailedPersonaCard
                  persona={selectedDetailPersona}
                  showCloseButton={false} // No close button for inline view
                />
              </div>
            )}
          </div>
        )}

        {/* Region personas display - UPDATED TO ADD INLINE DETAIL VIEW */}
        {!loading && !error && viewType === "region" && (
          <div className="mx-4">
            <h2 className="personas-header text-2xl font-bold mb-6 flex items-center justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF6B00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <div style={{ width: "12px" }}></div>
              <span>Region Personas</span>
            </h2>
            {regionLoading ? (
              <p>Loading regional personas...</p>
            ) : regionError ? (
              <p>Error: {regionError}</p>
            ) : (
              <PersonaList
                personas={regionPersonas} // Assuming regionPersonas is already sorted or doesn't need the same Global-first sorting as rolePersonas
                viewType={viewType}
                onPersonaClick={handlePersonaCardClick}
                selectedDetailPersonaId={
                  selectedDetailPersona ? selectedDetailPersona.id : null
                }
              />
            )}
            {/* Inline DetailedPersonaCard for Region View if a persona is selected */}
            {selectedDetailPersona && (
              <div className="mt-8">
                <DetailedPersonaCard
                  persona={selectedDetailPersona}
                  showCloseButton={false} // No close button for inline view
                />
              </div>
            )}
          </div>
        )}

        {/* Detail Modal - REMOVED */}
        {/* {selectedDetailPersona && viewType !== "role" && ( */}
        {/*   <PersonaDetailView */}
        {/*     selectedPersona={selectedDetailPersona} */}
        {/*     onClose={() => setSelectedDetailPersona(null)} */}
        {/*   /> */}
        {/* )} */}
      </main>
    </div>
  );
}

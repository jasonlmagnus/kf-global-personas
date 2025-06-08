"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
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
import ExperimentalGlobalPersonaTemplate from "./personas/ExperimentalGlobalPersonaTemplate";
import CEOSurveyDashboard from "./data/dashboards/CEOSurveyDashboard";
import CHROSurveyDashboard from "./data/dashboards/CHROSurveyDashboard";
import { useSearchParams } from "next/navigation";

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

// Helper function to get the base URL for API calls
function getBaseUrl(): string {
  // During build time (static generation), use localhost
  if (typeof window === "undefined") {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000";
  }
  // Client-side, use relative URLs
  return "";
}

// Helper to construct full URLs
function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

// DetailedPersonaCard component definition is removed from here if it exists.

// Component that uses useSearchParams wrapped in Suspense
function PersonaTestContent() {
  const searchParams = useSearchParams();
  const isExperimental = searchParams.get("view") === "experimental";

  // Change default region to 'global' instead of 'uk' and ensure it's set immediately
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

  // Add state for dynamic config data - initialize with default values to prevent loading issues
  const [dynamicRegions, setDynamicRegions] = useState<ConfigItem[]>([
    { id: "global", name: "Global" },
    { id: "uk", name: "United Kingdom" },
    { id: "uae", name: "United Arab Emirates" },
    { id: "aus", name: "Australia" },
  ]);
  const [dynamicDepartments, setDynamicDepartments] = useState<ConfigItem[]>([
    { id: "ceo", name: "CEO" },
    { id: "chro", name: "CHRO" },
    { id: "sales", name: "Sales" },
    { id: "talent", name: "Talent" },
    { id: "rewards", name: "Rewards" },
    { id: "leadership_dev", name: "Leadership Development" },
  ]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false); // Start as false since we have defaults
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
      // Handle cases where one or both regions are undefined
      if (a.region && !b.region) return -1;
      if (!a.region && b.region) return 1;

      // Fallback to title sort if region property is not available or for identical regions (e.g. two globals)
      // Ensure both titles exist before calling localeCompare
      const titleA = a.title || "";
      const titleB = b.title || "";
      return titleA.localeCompare(titleB);
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

  console.log("PersonaTest Debug:", {
    viewType,
    selectedRegion,
    selectedDepartment,
    persona: persona?.title || "null",
    personaLoading,
    personaError,
  });

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

  // Add effect to ensure single view always shows the loaded persona immediately
  useEffect(() => {
    if (viewType === "single" && persona) {
      setSelectedDetailPersona(persona);
    }
  }, [viewType, persona]);

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
        const response = await fetch(getFullUrl("/api/config"));
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        const configData = await response.json();

        // Merge fetched config with defaults, preferring fetched data
        if (configData.regions && configData.regions.length > 0) {
          setDynamicRegions(configData.regions);
        }
        if (configData.departments && configData.departments.length > 0) {
          setDynamicDepartments(configData.departments);
        }

        // No need for complex initialization logic since we have good defaults
        console.log("Config loaded successfully", {
          regions: configData.regions?.length,
          departments: configData.departments?.length,
        });
      } catch (error) {
        console.error("Error fetching config:", error);
        setConfigError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        // Keep default values on error - no need to clear them
      } finally {
        setIsLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []); // Empty dependency array to run once on mount

  // New state for selected dashboard
  const [selectedDashboard, setSelectedDashboard] = useState<
    "ceo" | "chro" | null
  >("ceo");

  // If in experimental mode and we have a global persona selected, show the experimental template
  if (
    isExperimental &&
    selectedDetailPersona &&
    isGlobalPersona(selectedDetailPersona)
  ) {
    return <ExperimentalGlobalPersonaTemplate />;
  }

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

        {/* For Experimental Template View */}
        {isExperimental && selectedDepartment === "ceo" && (
          <div className="container mx-auto">
            <ExperimentalGlobalPersonaTemplate />
          </div>
        )}

        {/* For Survey Dashboard View */}
        {isExperimental &&
          (selectedDepartment === "ceo" || selectedDepartment === "chro") && (
            <div className="w-full">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Survey Dashboard</h2>
                <div className="flex">
                  <button
                    onClick={() => setSelectedDashboard("ceo")}
                    className={`px-4 py-2 rounded-l ${
                      selectedDashboard === "ceo"
                        ? "bg-green-700 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    CEO Dashboard
                  </button>
                  <button
                    onClick={() => setSelectedDashboard("chro")}
                    className={`px-4 py-2 rounded-r ${
                      selectedDashboard === "chro"
                        ? "bg-green-700 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    CHRO Dashboard
                  </button>
                </div>
              </div>

              {selectedDashboard === "ceo" && <CEOSurveyDashboard />}
              {selectedDashboard === "chro" && <CHROSurveyDashboard />}
            </div>
          )}

        {/* Single view - handle directly without legacy wrapper */}
        {viewType === "single" && (
          <div className="mx-4">
            {personaLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0A523E]"></div>
              </div>
            )}
            {!personaLoading && personaError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                {personaError}
              </div>
            )}
            {!personaLoading && persona && (
              <DetailedPersonaCard persona={persona} showCloseButton={false} />
            )}
            {!personaLoading && !persona && !personaError && (
              <div className="text-center py-8 text-gray-500">
                <p>No persona data available for this selection.</p>
              </div>
            )}
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-[#003C2D] text-white p-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2024 Korn Ferry. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PersonaTest() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonaTestContent />
    </Suspense>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Region,
  Department,
  Persona,
  GlobalPersona,
  CountryPersona,
  isGlobalPersona,
  isCountryPersona,
} from "../types/personas";
import { usePersona, usePersonasByRegion } from "../hooks/usePersonas";
import {
  Globe,
  Target,
  AlertTriangle,
  Activity,
  Users,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

// Hardcoded for initial testing - would come from API in production
// Remove global from available regions for now
const availableRegions: Region[] = ["uk", "uae", "aus"];
const availableDepartments: Department[] = [
  "ceo",
  "chro",
  "sales",
  "talent",
  "rewards",
  "leadership_dev",
];

// Add a helper function to determine if region code should be hidden
const shouldHideRegionCode = (title: string, region: string): boolean => {
  // Check if the title already contains the region name
  const regionNames: Record<string, string[]> = {
    aus: ["Australia", "Australian", "AUS"],
    uk: ["UK", "British", "England", "United Kingdom"],
    uae: ["UAE", "Emirates", "Dubai", "Abu Dhabi"],
  };

  const regionVariants = regionNames[region.toLowerCase()] || [];
  return regionVariants.some((variant) =>
    title.toLowerCase().includes(variant.toLowerCase())
  );
};

// Function to get the right background image for each region
const getRegionBackground = (region: Region): string => {
  // Try to use background images first
  try {
    switch (region) {
      case "uk":
        return `url('/images/uk-bg.jpg'), linear-gradient(to bottom, #1a3a5f, #0a192f)`;
      case "uae":
        return `url('/images/uae-bg.jpg'), linear-gradient(to bottom, #a56729, #704214)`;
      case "aus":
        return `url('/images/aus-bg.jpg'), linear-gradient(to bottom, #194b53, #0d2c32)`;
      case "global":
      default:
        return "linear-gradient(to bottom, #0A523E, #042b20)";
    }
  } catch (error) {
    // Fallback to gradients if images fail to load
    switch (region) {
      case "uk":
        return "linear-gradient(to bottom, #1a3a5f, #0a192f)";
      case "uae":
        return "linear-gradient(to bottom, #a56729, #704214)";
      case "aus":
        return "linear-gradient(to bottom, #194b53, #0d2c32)";
      case "global":
      default:
        return "linear-gradient(to bottom, #0A523E, #042b20)";
    }
  }
};

/**
 * A component for testing and understanding the persona data structure
 */
export function PersonaTest() {
  // Change default region to 'uk' instead of 'global'
  const [selectedRegion, setSelectedRegion] = useState<Region>("uk");
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department>("ceo");
  const [comparedRegion, setComparedRegion] = useState<Region | null>(null);
  const [viewType, setViewType] = useState<"single" | "role" | "region">(
    "single"
  );

  // Add state to hold role personas from all regions
  const [rolePersonas, setRolePersonas] = useState<Persona[]>([]);
  const [rolePersonasLoading, setRolePersonasLoading] = useState(false);
  const [rolePersonasError, setRolePersonasError] = useState<string | null>(
    null
  );

  // Add this new state for the selected persona in modal view
  const [selectedDetailPersona, setSelectedDetailPersona] =
    useState<Persona | null>(null);

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
  } = usePersona(comparedRegion || "global", selectedDepartment);

  // Set up the comparison when needed
  useEffect(() => {
    if (viewType === "role") {
      // For Role Personas view, we'll compare across all regions
      setComparedRegion(selectedRegion === "uk" ? "uae" : "uk");
    } else {
      setComparedRegion(null);
    }
  }, [viewType, selectedRegion]);

  // Fetch personas for the selected role across all regions
  useEffect(() => {
    if (viewType !== "role" || !selectedDepartment) return;

    const fetchRolePersonas = async () => {
      setRolePersonasLoading(true);
      setRolePersonasError(null);

      try {
        // Get role personas from each region
        const regions: Region[] = ["uk", "uae", "aus"];
        const personas: Persona[] = [];

        // Fetch persona for each region
        const fetchPromises = regions.map((region) =>
          fetch(
            `/api/personas?region=${region}&department=${selectedDepartment}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data && !data.error) {
                personas.push(data);
              }
            })
            .catch((err) =>
              console.error(`Error fetching ${region} persona:`, err)
            )
        );

        await Promise.all(fetchPromises);
        setRolePersonas(personas.filter(Boolean));
      } catch (error) {
        console.error("Error fetching role personas:", error);
        setRolePersonasError("Failed to load role personas");
      } finally {
        setRolePersonasLoading(false);
      }
    };

    fetchRolePersonas();
  }, [viewType, selectedDepartment]);

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

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="app-header">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Korn Ferry Global Personas</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="nav-filters">
        <div className="filter-container">
          <div className="filter-item">
            <label className="selector-label">Persona Type</label>
            <div className="selector-wrapper">
              <select
                className="selector"
                value={viewType}
                onChange={(e) =>
                  setViewType(e.target.value as "single" | "role" | "region")
                }
              >
                <option value="single">Single Persona</option>
                <option value="role">Role Personas</option>
                <option value="region">Region Personas</option>
              </select>
              <ChevronDown className="selector-icon" />
            </div>
          </div>
          <div className="filter-item">
            <label className="selector-label">Role</label>
            <div className="selector-wrapper">
              <select
                className="selector"
                value={selectedDepartment}
                onChange={(e) =>
                  setSelectedDepartment(e.target.value as Department)
                }
              >
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="selector-icon" />
            </div>
          </div>
          <div className="filter-item">
            <label className="selector-label">Region</label>
            <div className="selector-wrapper">
              <select
                className="selector"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region)}
              >
                {availableRegions.map((region) => (
                  <option key={region} value={region}>
                    {region.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="selector-icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
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

        {/* Display persona - Single view */}
        {!loading && persona && !error && viewType === "single" && (
          <div className="content-card">
            <div className="flex items-start mb-6 pb-4 border-b">
              <Globe className="mr-3 shrink-0 text-[#0A523E]" size={24} />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-[#0A523E]">
                  {persona.title}
                </h2>
                {!shouldHideRegionCode(persona.title, persona.region) && (
                  <span className="px-3 py-1 mt-2 inline-block bg-gray-100 rounded-full text-gray-600 font-medium">
                    {persona.region.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {isGlobalPersona(persona) ? (
              <>
                <div className="mb-8">
                  <h3 className="section-title mb-3">
                    <Target className="section-icon" />
                    Goal Statement
                  </h3>
                  <p className="section-content">{persona.goalStatement}</p>
                </div>
                {persona.keyResponsibilities && (
                  <div className="mb-8">
                    <h3 className="section-title mb-3">
                      <Activity className="section-icon" />
                      Key Responsibilities
                    </h3>
                    <ul className="list-disc pl-8 section-content space-y-2">
                      {persona.keyResponsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="section-title mb-3">
                    <Target className="section-icon" />
                    User Goal Statement
                  </h3>
                  <p className="section-content">{persona.userGoalStatement}</p>
                </div>

                {persona.painPoints && persona.painPoints.length > 0 && (
                  <div className="mb-8">
                    <h3 className="section-title mb-3">
                      <AlertTriangle className="section-icon" />
                      Pain Points
                    </h3>
                    <ul className="list-disc pl-8 section-content space-y-2">
                      {persona.painPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {persona.regionalNuances &&
                  persona.regionalNuances.length > 0 && (
                    <div className="mb-8">
                      <h3 className="section-title mb-3">
                        <Globe className="section-icon" />
                        Regional Nuances
                      </h3>
                      <ul className="list-disc pl-8 section-content space-y-2">
                        {persona.regionalNuances.map((nuance, index) => (
                          <li key={index}>{nuance}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {persona.behaviors && persona.behaviors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="section-title mb-3">
                      <Activity className="section-icon" />
                      Behaviors
                    </h3>
                    <ul className="list-disc pl-8 section-content space-y-2">
                      {persona.behaviors.map((behavior, index) => (
                        <li key={index}>{behavior}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {persona.keyResponsibilities &&
                  persona.keyResponsibilities.length > 0 && (
                    <div className="mb-8">
                      <h3 className="section-title mb-3">
                        <Activity className="section-icon" />
                        Key Responsibilities
                      </h3>
                      <ul className="list-disc pl-8 section-content space-y-2">
                        {persona.keyResponsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {persona.collaborationInsights &&
                  persona.collaborationInsights.length > 0 && (
                    <div className="mb-8">
                      <h3 className="section-title mb-3">
                        <Users className="section-icon" />
                        Collaboration Insights
                      </h3>
                      <ul className="list-disc pl-8 section-content space-y-2">
                        {persona.collaborationInsights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </>
            )}

            {/* Common fields */}
            {persona.quote && (
              <div className="mb-8">
                <h3 className="section-title mb-3">Quote</h3>
                <p className="section-content italic">
                  &ldquo;{persona.quote}&rdquo;
                </p>
              </div>
            )}

            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Target className="section-icon" />
                Needs
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.needs.map((need, index) => (
                  <li key={index}>{need}</li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Motivations
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.motivations.map((motivation, index) => (
                  <li key={index}>{motivation}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Region personas display */}
        {!loading &&
          regionPersonas.length > 0 &&
          !error &&
          viewType === "region" && (
            <div className="content-card">
              <h2 className="text-2xl font-bold text-[#0A523E] mb-6 flex items-center">
                <Globe className="mr-3 text-[#FF6B00]" size={24} />
                {selectedRegion.toUpperCase()} Region Personas
              </h2>
              <div className="grid grid-cols-3 gap-6 w-full">
                {regionPersonas.map((p) => (
                  <div
                    key={p.id}
                    className="role-card"
                    onClick={() => handlePersonaCardClick(p)}
                  >
                    <div className="role-card-image">
                      <div
                        className="role-card-image-bg"
                        style={{
                          backgroundImage: getRegionBackground(p.region),
                        }}
                      ></div>
                      <div className="role-card-gradient"></div>
                      <div className="role-card-content">
                        <h3 className="role-card-title">{p.title}</h3>
                        <button className="role-card-button">
                          View Details
                          <ArrowRight className="role-card-button-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Role Personas view */}
        {!loading &&
          rolePersonas.length > 0 &&
          !error &&
          viewType === "role" && (
            <div className="content-card">
              <h2 className="text-2xl font-bold text-[#0A523E] mb-6 flex items-center">
                <Globe className="mr-3 text-[#FF6B00]" size={24} />
                {selectedDepartment.replace("_", " ").toUpperCase()} Role Across
                Regions
              </h2>
              <div className="grid grid-cols-3 gap-6 w-full">
                {rolePersonas.map((p) => (
                  <div
                    key={p.id}
                    className="role-card"
                    onClick={() => handlePersonaCardClick(p)}
                  >
                    <div className="role-card-image">
                      <div
                        className="role-card-image-bg"
                        style={{
                          backgroundImage: getRegionBackground(p.region),
                        }}
                      ></div>
                      <div className="role-card-gradient"></div>
                      <div className="role-card-content">
                        <h3 className="role-card-title">{p.title}</h3>
                        <button className="role-card-button">
                          View Details
                          <ArrowRight className="role-card-button-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Detail Modal */}
        {selectedDetailPersona && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#0A523E]">
                      {selectedDetailPersona.title}
                    </h2>
                    {!shouldHideRegionCode(
                      selectedDetailPersona.title,
                      selectedDetailPersona.region
                    ) && (
                      <span className="px-3 py-1 mt-2 inline-block bg-gray-100 rounded-full text-gray-600 font-medium">
                        {selectedDetailPersona.region.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDetailPersona(null)}
                    className="text-gray-600 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>

                {isGlobalPersona(selectedDetailPersona) ? (
                  <>
                    <div className="mb-8">
                      <h3 className="section-title mb-3">
                        <Target className="section-icon" />
                        Goal Statement
                      </h3>
                      <p className="section-content">
                        {selectedDetailPersona.goalStatement}
                      </p>
                    </div>
                    {selectedDetailPersona.keyResponsibilities && (
                      <div className="mb-8">
                        <h3 className="section-title mb-3">
                          <Activity className="section-icon" />
                          Key Responsibilities
                        </h3>
                        <ul className="list-disc pl-8 section-content space-y-2">
                          {selectedDetailPersona.keyResponsibilities.map(
                            (resp, index) => (
                              <li key={index}>{resp}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="section-title mb-3">
                        <Target className="section-icon" />
                        User Goal Statement
                      </h3>
                      <p className="section-content">
                        {selectedDetailPersona.userGoalStatement}
                      </p>
                    </div>

                    {selectedDetailPersona.painPoints &&
                      selectedDetailPersona.painPoints.length > 0 && (
                        <div className="mb-8">
                          <h3 className="section-title mb-3">
                            <AlertTriangle className="section-icon" />
                            Pain Points
                          </h3>
                          <ul className="list-disc pl-8 section-content space-y-2">
                            {selectedDetailPersona.painPoints.map(
                              (point, index) => (
                                <li key={index}>{point}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedDetailPersona.regionalNuances &&
                      selectedDetailPersona.regionalNuances.length > 0 && (
                        <div className="mb-8">
                          <h3 className="section-title mb-3">
                            <Globe className="section-icon" />
                            Regional Nuances
                          </h3>
                          <ul className="list-disc pl-8 section-content space-y-2">
                            {selectedDetailPersona.regionalNuances.map(
                              (nuance, index) => (
                                <li key={index}>{nuance}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedDetailPersona.behaviors &&
                      selectedDetailPersona.behaviors.length > 0 && (
                        <div className="mb-8">
                          <h3 className="section-title mb-3">
                            <Activity className="section-icon" />
                            Behaviors
                          </h3>
                          <ul className="list-disc pl-8 section-content space-y-2">
                            {selectedDetailPersona.behaviors.map(
                              (behavior, index) => (
                                <li key={index}>{behavior}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedDetailPersona.keyResponsibilities &&
                      selectedDetailPersona.keyResponsibilities.length > 0 && (
                        <div className="mb-8">
                          <h3 className="section-title mb-3">
                            <Activity className="section-icon" />
                            Key Responsibilities
                          </h3>
                          <ul className="list-disc pl-8 section-content space-y-2">
                            {selectedDetailPersona.keyResponsibilities.map(
                              (resp, index) => (
                                <li key={index}>{resp}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedDetailPersona.collaborationInsights &&
                      selectedDetailPersona.collaborationInsights.length >
                        0 && (
                        <div className="mb-8">
                          <h3 className="section-title mb-3">
                            <Users className="section-icon" />
                            Collaboration Insights
                          </h3>
                          <ul className="list-disc pl-8 section-content space-y-2">
                            {selectedDetailPersona.collaborationInsights.map(
                              (insight, index) => (
                                <li key={index}>{insight}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </>
                )}

                {/* Common fields */}
                {selectedDetailPersona.quote && (
                  <div className="mb-8">
                    <h3 className="section-title mb-3">Quote</h3>
                    <p className="section-content italic">
                      &ldquo;{selectedDetailPersona.quote}&rdquo;
                    </p>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="section-title mb-3">
                    <Target className="section-icon" />
                    Needs
                  </h3>
                  <ul className="list-disc pl-8 section-content space-y-2">
                    {selectedDetailPersona.needs.map((need, index) => (
                      <li key={index}>{need}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="section-title mb-3">
                    <Activity className="section-icon" />
                    Motivations
                  </h3>
                  <ul className="list-disc pl-8 section-content space-y-2">
                    {selectedDetailPersona.motivations.map(
                      (motivation, index) => (
                        <li key={index}>{motivation}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

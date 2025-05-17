"use client";

import React, { useState, useEffect } from "react";
import {
  Region,
  Department,
  Persona,
  isGlobalPersona,
} from "../types/personas";
import { usePersona, usePersonasByRegion } from "../hooks/usePersonas";
import {
  Globe,
  Target,
  AlertTriangle,
  Activity,
  Users,
  ChevronDown,
  FileDown,
} from "lucide-react";
import { generatePersonaDocument } from "@/lib/docGenerator";

// Define interface for API config items
interface ConfigItem {
  id: string;
  name: string;
}

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

// Function to get the right background image based on role/department
const getRoleImage = (department: Department): string => {
  // Map department to executive roles
  const roleMapping: { [key: string]: string } = {
    ceo: "Chief Executive Officer",
    chro: "Chief HR Officer",
    sales: "Chief Marketing Officer", // using marketing for sales
    talent: "Chief Operations Officer", // using operations for talent
    rewards: "Chief Financial Officer",
    leadership_dev: "Chief Technology Officer",
  };

  // Get the executive role title
  const roleTitle = roleMapping[department] || "Chief Executive Officer";

  // Map to the exact URLs provided
  switch (roleTitle) {
    case "Chief Executive Officer":
      return "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80')";
    case "Chief Technology Officer":
      return "url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80')";
    case "Chief Financial Officer":
      return "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80')";
    case "Chief HR Officer":
      return "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')";
    case "Chief Marketing Officer":
      return "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80')";
    case "Chief Operations Officer":
      return "url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80')";
    default:
      return "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80')";
  }
};

// Add this component - extracts the detailed content from before
const PersonaDetailsContent = ({ persona }: { persona: Persona }) => {
  return (
    <>
      {isGlobalPersona(persona) ? (
        <>
          <div className="mb-8">
            <h3 className="section-title mb-3">
              <Target className="section-icon" />
              Goal Statement
            </h3>
            <p className="section-content">{persona.goalStatement}</p>
          </div>

          {/* Core Belief section */}
          {persona.coreBelief && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Target className="section-icon" />
                Core Belief
              </h3>
              <p className="section-content">{persona.coreBelief}</p>
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
          {persona.knowledgeOrExpertise &&
            persona.knowledgeOrExpertise.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <Users className="section-icon" />{" "}
                  {/* Placeholder icon, choose appropriate */}
                  Knowledge/Expertise
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.knowledgeOrExpertise.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          {persona.typicalChallenges &&
            persona.typicalChallenges.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <AlertTriangle className="section-icon" />{" "}
                  {/* Placeholder icon */}
                  Typical Challenges
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.typicalChallenges.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          {persona.currentProjects && persona.currentProjects.length > 0 && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" /> {/* Placeholder icon */}
                Current Projects
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.currentProjects.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Render painPoints for GlobalPersona if they exist */}
          {persona.painPoints && persona.painPoints.length > 0 && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <AlertTriangle className="section-icon" />
                Pain Points (Global)
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.painPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Render behaviors for GlobalPersona if they exist */}
          {persona.behaviors && persona.behaviors.length > 0 && (
            <div className="mb-8">
              <h3 className="section-title mb-3">
                <Activity className="section-icon" />
                Behaviors (Global)
              </h3>
              <ul className="list-disc pl-8 section-content space-y-2">
                {persona.behaviors.map((behavior, index) => (
                  <li key={index}>{behavior}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Render collaborationInsights for GlobalPersona if they exist */}
          {persona.collaborationInsights &&
            persona.collaborationInsights.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <Users className="section-icon" />
                  Collaboration Insights (Global)
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.collaborationInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
          {/* Emotional Triggers section */}
          {persona.emotionalTriggers &&
            persona.emotionalTriggers.raw &&
            persona.emotionalTriggers.raw.length > 0 && (
              <div className="mb-8">
                <h3 className="section-title mb-3">
                  <AlertTriangle className="section-icon" />
                  Emotional Triggers
                </h3>
                <ul className="list-disc pl-8 section-content space-y-2">
                  {persona.emotionalTriggers.raw.map(
                    (trigger: any, index: number) => (
                      <li key={index}>
                        <strong>{trigger.Trigger || "Trigger"}</strong>:{" "}
                        {trigger.Emotional_Response || trigger.Response || ""}
                        {trigger.Messaging_Implication && (
                          <div className="text-sm ml-4 mt-1 text-gray-600">
                            <em>Messaging: {trigger.Messaging_Implication}</em>
                          </div>
                        )}
                      </li>
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

          {persona.regionalNuances && persona.regionalNuances.length > 0 && (
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
    </>
  );
};

// Create a reusable component for displaying detailed persona information consistently
const DetailedPersonaCard = ({
  persona,
  showCloseButton = false,
  onClose = () => {},
}: {
  persona: Persona;
  showCloseButton?: boolean;
  onClose?: () => void;
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    generatePersonaDocument(persona);
  };

  return (
    <div className="content-card">
      <button
        className="export-button"
        onClick={handleDownload}
        title="Download as Word document"
      >
        <FileDown className="h-4 w-4" />
        <span>Export</span>
      </button>

      <div className="detailed-card-header">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#000000]">{persona.title}</h2>
          {!shouldHideRegionCode(persona.title, persona.region) && (
            <span className="px-3 py-1 mt-2 inline-block bg-gray-100 rounded-full text-gray-600 font-medium">
              {persona.region.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showCloseButton && (
            <button onClick={onClose} className="close-button-modal">
              Close
            </button>
          )}
        </div>
      </div>

      <PersonaDetailsContent persona={persona} />
    </div>
  );
};

/**
 * A component for testing and understanding the persona data structure
 */
export function PersonaTest() {
  // Change default region to 'uk' instead of 'global'
  const [selectedRegion, setSelectedRegion] = useState<Region>("uk");
  // Add state to store previous region when switching to role view
  const [savedRegion, setSavedRegion] = useState<Region | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department>("ceo");
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

  // Add state to hold role personas from all regions
  const [rolePersonas, setRolePersonas] = useState<Persona[]>([]);
  const [rolePersonasLoading, setRolePersonasLoading] = useState(false);
  const [rolePersonasError, setRolePersonasError] = useState<string | null>(
    null
  );

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

  // Function to get the right background image for each region
  const getRegionBackground = (
    region: Region,
    department?: Department
  ): string => {
    // ROLE VIEW: For cards in the role grid, use region/country images
    // to show the same role across different regions
    if (viewType === "role" && department) {
      // Country-specific images for Role view
      switch (region) {
        case "uk":
          return `url('https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80')`;
        case "uae":
          return `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80')`;
        case "aus":
          return `url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80')`;
        default:
          return `url('https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80')`;
      }
    }

    // REGION VIEW: For cards in the region grid, use role/department images
    // to show different roles within the same region
    if (viewType === "region" && department) {
      return getRoleImage(department);
    }

    // Fallback to region-based backgrounds if no department is specified
    try {
      switch (region) {
        case "uk":
          return `url('https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80'), linear-gradient(to bottom, #1a3a5f, #0a192f)`;
        case "uae":
          return `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80'), linear-gradient(to bottom, #a56729, #704214)`;
        case "aus":
          return `url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80'), linear-gradient(to bottom, #194b53, #0d2c32)`;
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

  // Helper: generate consistent title in Role view cards
  const getRoleCardTitle = (p: Persona): string => {
    if (viewType === "role" && p.region === "global") {
      return `Global ${p.department.toUpperCase()}`;
    }
    return p.title;
  };

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
        // Get role personas from each region, INCLUDING global
        const regionsToFetch = dynamicRegions
          // .filter((r) => r.id !== "global") // REMOVED: filter to exclude global
          .map((r) => r.id as Region);

        const personas: Persona[] = [];

        // Fetch persona for each region
        const fetchPromises = regionsToFetch.map((region) =>
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
        const filteredPersonas = personas.filter(Boolean);
        setRolePersonas(filteredPersonas);

        // Set the first persona as selected by default if we have results
        if (filteredPersonas.length > 0) {
          setSelectedDetailPersona(filteredPersonas[0]);
        }
      } catch (error) {
        console.error("Error fetching role personas:", error);
        setRolePersonasError("Failed to load role personas");
      } finally {
        setRolePersonasLoading(false);
      }
    };

    fetchRolePersonas();
  }, [viewType, selectedDepartment, dynamicRegions]);

  // Update effect for fetching region personas to ensure it's not affected by role selection
  useEffect(() => {
    if (viewType === "region" && regionPersonas.length > 0) {
      setSelectedDetailPersona(regionPersonas[0]);
    } else if (viewType === "single" && persona) {
      // Clear selection when switching to single view
      setSelectedDetailPersona(null);
    }
  }, [viewType, regionPersonas, persona]);

  // Add an effect to handle viewType changes directly
  useEffect(() => {
    // Clear selection when switching view types
    setSelectedDetailPersona(null);
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
          if (!currentSelectedRegionIsValid) {
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
          setSelectedRegion("uk"); // Fallback or clear
        }

        if (configData.departments && configData.departments.length > 0) {
          const currentSelectedDeptIsValid = configData.departments.some(
            (d: ConfigItem) => d.id === selectedDepartment
          );
          if (!currentSelectedDeptIsValid) {
            setSelectedDepartment(configData.departments[0].id as Department);
          }
        } else {
          setSelectedDepartment("ceo"); // Fallback or clear
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
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="app-header">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="logo-container">
            <img
              src="/kf-logo-white.svg"
              alt="Korn Ferry Logo"
              className="logo"
            />
          </div>
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
              {viewType === "region" ? (
                // For Region view, show a disabled N/A selector for Role
                <div className="relative w-full">
                  <select
                    className="selector bg-gray-100 text-gray-400 cursor-not-allowed"
                    disabled={true}
                    tabIndex={-1}
                  >
                    <option value="n/a">N/A</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ) : (
                // For other views, show the normal role selector
                <>
                  <select
                    className="selector"
                    value={selectedDepartment}
                    onChange={(e) =>
                      setSelectedDepartment(e.target.value as Department)
                    }
                    disabled={
                      isLoadingConfig || dynamicDepartments.length === 0
                    }
                  >
                    {isLoadingConfig ? (
                      <option>Loading...</option>
                    ) : dynamicDepartments.length === 0 ? (
                      <option>N/A</option>
                    ) : (
                      <>
                        <option value="">Select Role</option>
                        {dynamicDepartments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <ChevronDown className="selector-icon" />
                </>
              )}
            </div>
          </div>
          <div className="filter-item">
            <label className="selector-label">Region</label>
            <div className="selector-wrapper">
              {viewType === "role" ? (
                // For Role view, show a disabled N/A selector
                <div className="relative w-full">
                  <select
                    className="selector bg-gray-100 text-gray-400 cursor-not-allowed"
                    disabled={true}
                    tabIndex={-1}
                  >
                    <option value="n/a">N/A</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ) : (
                // For other views, show the normal region selector
                <>
                  <select
                    className="selector"
                    value={selectedRegion}
                    onChange={(e) =>
                      setSelectedRegion(e.target.value as Region)
                    }
                    disabled={isLoadingConfig || dynamicRegions.length === 0}
                  >
                    {isLoadingConfig ? (
                      <option>Loading...</option>
                    ) : dynamicRegions.length === 0 ? (
                      <option>N/A</option>
                    ) : (
                      <>
                        <option value="">Select Region</option>
                        {dynamicRegions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <ChevronDown className="selector-icon" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
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
          <div className="mx-24">
            <DetailedPersonaCard persona={persona} showCloseButton={false} />
          </div>
        )}

        {/* Role Personas view */}
        {!loading &&
          rolePersonas.length > 0 &&
          !error &&
          viewType === "role" && (
            <div className="mx-24">
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
              <div className="persona-role-grid">
                {rolePersonas.map((p) => (
                  <div
                    key={p.id}
                    className={`persona-nav-item ${
                      selectedDetailPersona && selectedDetailPersona.id === p.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handlePersonaCardClick(p)}
                  >
                    <div
                      className="persona-nav-bg"
                      style={{
                        backgroundImage: getRegionBackground(
                          p.region,
                          p.department
                        ),
                      }}
                    ></div>
                    <div className="persona-nav-content">
                      <h3 className="persona-nav-title">
                        {getRoleCardTitle(p)}
                      </h3>
                      <button className="persona-nav-button">
                        {selectedDetailPersona &&
                        selectedDetailPersona.id === p.id
                          ? "Selected"
                          : "View Details"}
                        <svg
                          className="ml-1"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 5L19 12L12 19"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Region personas display */}
        {!loading &&
          regionPersonas.length > 0 &&
          !error &&
          viewType === "region" && (
            <div className="mx-24">
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

              <div className="persona-nav-grid">
                {regionPersonas.map((p) => (
                  <div
                    key={p.id}
                    className={`persona-nav-item ${
                      selectedDetailPersona && selectedDetailPersona.id === p.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handlePersonaCardClick(p)}
                  >
                    <div
                      className="persona-nav-bg"
                      style={{
                        backgroundImage: getRegionBackground(
                          p.region,
                          p.department
                        ),
                      }}
                    ></div>
                    <div className="persona-nav-content">
                      <h3 className="persona-nav-title">{p.title}</h3>
                      <button className="persona-nav-button">
                        {selectedDetailPersona &&
                        selectedDetailPersona.id === p.id
                          ? "Selected"
                          : "View Details"}
                        <svg
                          className="ml-1"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 5L19 12L12 19"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
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
                <DetailedPersonaCard
                  persona={selectedDetailPersona}
                  showCloseButton={false}
                  onClose={() => setSelectedDetailPersona(null)}
                />
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => setSelectedDetailPersona(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

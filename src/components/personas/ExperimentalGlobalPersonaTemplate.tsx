import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Target,
  ListChecks,
  Users2,
  Eye,
  HelpCircle,
  AlertTriangle,
  TrendingUp,
  Search,
  MessageSquare,
  BookOpen,
  Lightbulb,
  FileText,
  Globe,
  GitCompareArrows,
  Activity,
  BookOpenCheck,
  Brain,
  Compass,
  Library,
  FileCheck,
  ChevronDown,
  User,
} from "lucide-react";

// Define the data structure types
interface PersonaData {
  metadata: {
    version: string;
    type: string;
    lastUpdated: string;
  };
  coreUnderstanding: {
    core: {
      role: string;
      userGoalStatement: string;
      coreBelief: string;
      contentImplication: string;
    };
    responsibilities: {
      items: Array<{
        Category: string;
        Description: string;
      }>;
      contentImplication: string;
    };
    knowledge: {
      items: string[];
      contentImplication: string;
    };
  };
  strategicValuePoints: {
    connectionOpportunities: {
      items: Array<{
        Area: string;
        Finding: string;
        Leverage_Point: string;
        dataSource: string;
      }>;
      contentImplication: string;
    };
    motivations: {
      items: string[];
      contentImplication: string;
    };
    needs: {
      items: Array<{
        Category: string;
        Description: string;
      }>;
      contentImplication: string;
    };
  };
  painPointsAndChallenges: {
    perceptionGaps: {
      items: Array<{
        Area: string;
        Gap: string;
        Business_Impact: string;
        Opportunity: string;
        dataSource: string;
      }>;
      contentImplication: string;
    };
    frustrations: {
      items: string[];
      contentImplication: string;
    };
    emotionalTriggers: {
      items: Array<{
        Trigger: string;
        Emotional_Response: string;
        Messaging_Implication: string;
      }>;
      contentImplication: string;
    };
  };
  engagementApproach: {
    description: string;
    behaviors: {
      items: string[];
      contentImplication: string;
    };
    collaborationInsights: {
      items: string[];
      contentImplication: string;
    };
    problemSolvingMethod: {
      description: string;
      value: string;
    };
    analogies: {
      items: string[];
      contentImplication: string;
    };
    messagingAngles?: {
      description: string;
      items: string[];
      contentImplication: string;
    };
  };
  supportingResources: {
    description: string;
    referenceSources: Array<{
      Category: string;
      Sources: string[];
      URLs?: string[];
    }>;
  };
}

// Define available personas
interface PersonaOption {
  id: string;
  name: string;
  path: string;
  description: string;
}

const AVAILABLE_PERSONAS: PersonaOption[] = [
  {
    id: "ceo",
    name: "CEO",
    path: "/data/global/ceo/ceo_v3.json",
    description: "Chief Executive Officer",
  },
  {
    id: "chro",
    name: "CHRO",
    path: "/data/global/chro/chro_v3.json",
    description: "Chief Human Resources Officer",
  },
  {
    id: "leadership_dev",
    name: "Leadership Development",
    path: "/data/global/leadership_dev/leadership_dev_v3.json",
    description: "Leadership Development Leader",
  },
  {
    id: "rewards",
    name: "Rewards Leader",
    path: "/data/global/rewards/rewards_v3.json",
    description: "Rewards & Compensation Leader",
  },
  {
    id: "sales",
    name: "Sales Leader",
    path: "/data/global/sales/sales_v3.json",
    description: "Sales Leadership",
  },
  {
    id: "talent",
    name: "Talent Acquisition",
    path: "/data/global/talent/talent_v3.json",
    description: "Talent Acquisition Leader",
  },
];

// Add new section icons
const sectionIcons = {
  // Core Understanding
  role: <Briefcase size={20} className="text-[#003C2D] mr-2" />,
  userGoalStatement: <Target size={20} className="text-[#003C2D] mr-2" />,
  coreBelief: <Eye size={20} className="text-[#003C2D] mr-2" />,
  responsibilities: <Activity size={20} className="text-[#003C2D] mr-2" />,
  knowledge: <BookOpen size={20} className="text-[#003C2D] mr-2" />,

  // Strategic Value Points
  connectionOpportunities: (
    <MessageSquare size={20} className="text-[#FF6B00] mr-2" />
  ),
  motivations: <TrendingUp size={20} className="text-[#FF6B00] mr-2" />,
  needs: <HelpCircle size={20} className="text-[#FF6B00] mr-2" />,

  // Pain Points and Challenges
  perceptionGaps: <Search size={20} className="text-[#B91C1C] mr-2" />,
  frustrations: <AlertTriangle size={20} className="text-[#B91C1C] mr-2" />,
  emotionalTriggers: <Brain size={20} className="text-[#B91C1C] mr-2" />,

  // Engagement Approach
  behaviors: <Activity size={20} className="text-[#003C2D] mr-2" />,
  collaborationInsights: <Users2 size={20} className="text-[#003C2D] mr-2" />,
  problemSolving: <Compass size={20} className="text-[#003C2D] mr-2" />,
  analogies: <Lightbulb size={20} className="text-[#003C2D] mr-2" />,
  messagingAngles: <MessageSquare size={20} className="text-[#003C2D] mr-2" />,

  // Supporting Resources
  references: <Library size={20} className="text-[#003C2D] mr-2" />,
};

const GREEN_DARK = "#0E4230";
const GREEN_MEDIUM = "#177D52";
const GREEN_BG = "rgba(194, 217, 210, 0.5)";
const ORANGE = "#FF6B00";
const RED = "#B91C1C";

const ExperimentalGlobalPersonaTemplate = () => {
  const searchParams = useSearchParams();
  const isExperimental = searchParams.get("view") === "experimental";
  const urlPersona = searchParams.get("persona");

  // State for persona data and selection
  const [selectedPersona, setSelectedPersona] = useState<string>(
    urlPersona || "ceo"
  );
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);

  // Expanded groups state
  const [expandedGroups, setExpandedGroups] = useState({
    coreUnderstanding: true, // Always expanded by default
    strategicValuePoints: false,
    painPointsAndChallenges: false,
    engagementApproach: false,
    supportingResources: false,
  });

  // Load persona data
  useEffect(() => {
    const loadPersonaData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const selectedPersonaConfig = AVAILABLE_PERSONAS.find(
          (p) => p.id === selectedPersona
        );
        if (!selectedPersonaConfig) {
          throw new Error(`Persona ${selectedPersona} not found`);
        }

        const response = await fetch(selectedPersonaConfig.path);
        if (!response.ok) {
          throw new Error(
            `Failed to load persona data: ${response.statusText}`
          );
        }
        const data = await response.json();
        setPersonaData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonaData();
  }, [selectedPersona]);

  // Update URL when persona changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("persona", selectedPersona);
      window.history.replaceState({}, "", url.toString());
    }
  }, [selectedPersona]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".persona-dropdown")) {
        setShowPersonaDropdown(false);
      }
    };

    if (showPersonaDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPersonaDropdown]);

  if (!isExperimental) return null;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading persona data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!personaData) return null;

  const currentPersona = AVAILABLE_PERSONAS.find(
    (p) => p.id === selectedPersona
  );

  // Toggle group expansion
  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  // Expand/collapse all groups
  const expandAll = () =>
    setExpandedGroups({
      coreUnderstanding: true,
      strategicValuePoints: true,
      painPointsAndChallenges: true,
      engagementApproach: true,
      supportingResources: true,
    });
  const collapseAll = () =>
    setExpandedGroups({
      coreUnderstanding: false,
      strategicValuePoints: false,
      painPointsAndChallenges: false,
      engagementApproach: false,
      supportingResources: false,
    });

  // Helper for group button label
  const getGroupButtonLabel = (group: keyof typeof expandedGroups) =>
    expandedGroups[group] ? "Hide Group" : "Expand Group";

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 border border-gray-200">
        {/* Title Section */}
        <div className="mb-8">
          {/* Persona Selector */}
          <div className="mb-6">
            <div className="relative persona-dropdown">
              <button
                onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-green-500 transition-colors duration-200 min-w-[250px]"
              >
                <User size={20} className="text-[#003C2D]" />
                <span className="font-medium text-gray-700">
                  {currentPersona?.name} - {currentPersona?.description}
                </span>
                <ChevronDown size={16} className="text-gray-500 ml-auto" />
              </button>

              {showPersonaDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {AVAILABLE_PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersona(persona.id);
                        setShowPersonaDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                        selectedPersona === persona.id
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="font-medium">{persona.name}</div>
                      <div className="text-sm text-gray-500">
                        {persona.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-[#003C2D] flex items-center gap-3">
                <Globe size={36} className="text-[#003C2D]" />
                {currentPersona?.name} Persona Template (v3)
              </h1>
              <div className="mt-2 flex items-center gap-2 text-gray-600">
                <FileText size={16} />
                <span>
                  Interactive Experimental Version{" "}
                  {personaData?.metadata.version} - v3 Global Personas
                </span>
                <span className="mx-2">•</span>
                <span>For Global Content Marketing Team</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={expandAll}
                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-green-50 transition-all duration-200"
                style={{ color: GREEN_MEDIUM, borderColor: GREEN_MEDIUM }}
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 transition-all duration-200"
                style={{ color: GREEN_DARK, borderColor: GREEN_DARK }}
              >
                Collapse All
              </button>
              <button className="flex items-center bg-[#ff6b00] text-white px-5 py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:ring-opacity-50 whitespace-nowrap">
                <FileCheck size={18} className="mr-2" />
                Export Persona
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{
                width: `${
                  (Object.values(expandedGroups).filter(Boolean).length /
                    Object.keys(expandedGroups).length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Groups Container */}
        <div className="space-y-8">
          {/* === GROUP 1: Core Understanding === */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-2xl font-bold flex items-center gap-2"
                      style={{ color: GREEN_DARK }}
                    >
                      <BookOpenCheck size={24} className="text-[#003C2D]" />
                      1. Core Understanding
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Start here: Foundational information about the{" "}
                      {currentPersona?.name}'s identity and scope
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-green-50 transition-all duration-200"
                      style={{ color: GREEN_MEDIUM, borderColor: GREEN_MEDIUM }}
                      onClick={() => toggleGroup("coreUnderstanding")}
                    >
                      {getGroupButtonLabel("coreUnderstanding")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Understanding Content */}
            {expandedGroups.coreUnderstanding && (
              <div className="p-6 space-y-6">
                {/* Core Information */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.role}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Role
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {personaData.coreUnderstanding.core.role}
                  </p>
                  <div className="flex items-center mt-4 mb-2">
                    {sectionIcons.userGoalStatement}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      User Goal Statement
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {personaData.coreUnderstanding.core.userGoalStatement}
                  </p>
                  <div className="flex items-center mt-4 mb-2">
                    {sectionIcons.coreBelief}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Core Belief
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {personaData.coreUnderstanding.core.coreBelief}
                  </p>
                  <div
                    className="mt-4 mb-2 p-3 rounded"
                    style={{
                      background: GREEN_BG,
                      borderLeft: `4px solid ${GREEN_DARK}`,
                    }}
                  >
                    <h4
                      className="font-medium mb-1"
                      style={{ color: GREEN_DARK }}
                    >
                      Content Marketing Implication
                    </h4>
                    <p className="text-gray-800">
                      {personaData.coreUnderstanding.core.contentImplication}
                    </p>
                  </div>
                </div>

                {/* Key Responsibilities */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.responsibilities}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Key Responsibilities
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personaData.coreUnderstanding.responsibilities.items.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-500 transition-colors duration-200"
                        >
                          <h4 className="font-medium text-gray-800">
                            {item.Category}
                          </h4>
                          <p className="text-gray-700 mt-2">
                            {item.Description}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Knowledge Areas */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.knowledge}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Knowledge Areas
                    </h3>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personaData.coreUnderstanding.knowledge.items.map(
                      (item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="mt-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200 my-8" />

          {/* === GROUP 2: Strategic Value Points === */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h2
                    className="text-2xl font-bold flex items-center gap-2"
                    style={{ color: GREEN_DARK }}
                  >
                    <BookOpen size={24} className="text-[#003C2D]" />
                    2. Strategic Value Points
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Key drivers and needs that inform content topics, hooks, and
                    value propositions
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-green-50 transition-all duration-200"
                  style={{ color: GREEN_MEDIUM, borderColor: GREEN_MEDIUM }}
                  onClick={() => toggleGroup("strategicValuePoints")}
                >
                  {getGroupButtonLabel("strategicValuePoints")}
                </button>
              </div>
            </div>

            {expandedGroups.strategicValuePoints && (
              <div className="p-6">
                {/* Connection Opportunities */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.connectionOpportunities}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Connection Opportunities
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {personaData.strategicValuePoints.connectionOpportunities.items.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-500 transition-colors duration-200"
                        >
                          <h4 className="font-medium text-gray-800">
                            {item.Area}
                          </h4>
                          <p className="text-gray-700">
                            <span className="font-medium">Finding:</span>{" "}
                            {item.Finding}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Leverage Point:</span>{" "}
                            {item.Leverage_Point}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Motivations */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.motivations}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Motivations
                    </h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {personaData.strategicValuePoints.motivations.items.map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                {/* Needs */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.needs}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Needs
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {personaData.strategicValuePoints.needs.items.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-500 transition-colors duration-200"
                        >
                          <h4 className="font-medium text-gray-800">
                            {item.Category}
                          </h4>
                          <p className="text-gray-700">{item.Description}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t border-gray-200 my-8" />

          {/* === GROUP 3: Pain Points and Challenges === */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h2
                    className="text-2xl font-bold flex items-center gap-2"
                    style={{ color: GREEN_DARK }}
                  >
                    <BookOpen size={24} className="text-[#003C2D]" />
                    3. Pain Points and Challenges
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Crucial sources for problem-focused content hooks and
                    emotional drivers
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-green-50 transition-all duration-200"
                  style={{ color: GREEN_MEDIUM, borderColor: GREEN_MEDIUM }}
                  onClick={() => toggleGroup("painPointsAndChallenges")}
                >
                  {getGroupButtonLabel("painPointsAndChallenges")}
                </button>
              </div>
            </div>

            {expandedGroups.painPointsAndChallenges && (
              <div className="p-6">
                {/* Perception Gaps */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.perceptionGaps}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Perception Gaps
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {personaData.painPointsAndChallenges.perceptionGaps.items.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-red-500 transition-colors duration-200"
                        >
                          <h4 className="font-medium text-gray-800">
                            {item.Area}
                          </h4>
                          <p className="text-gray-700">
                            <span className="font-medium">Gap:</span> {item.Gap}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">
                              Business Impact:
                            </span>{" "}
                            {item.Business_Impact}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Opportunity:</span>{" "}
                            {item.Opportunity}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Frustrations & Pain Points */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.frustrations}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Frustrations & Pain Points
                    </h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {personaData.painPointsAndChallenges.frustrations.items.map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                {/* Emotional Triggers */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.emotionalTriggers}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Emotional Triggers
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {personaData.painPointsAndChallenges.emotionalTriggers.items.map(
                      (item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-red-500 transition-colors duration-200"
                        >
                          <h4 className="font-medium text-gray-800">
                            {item.Trigger}
                          </h4>
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">
                              Emotional Response:
                            </span>{" "}
                            {item.Emotional_Response}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">
                              Messaging Implication:
                            </span>{" "}
                            {item.Messaging_Implication}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* === GROUP 4: Engagement Approach === */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h2
                    className="text-2xl font-bold flex items-center gap-2"
                    style={{ color: GREEN_DARK }}
                  >
                    <BookOpen size={24} className="text-[#003C2D]" />
                    4. Engagement Approach
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Tactics and strategies for engaging with the persona
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-green-50 transition-all duration-200"
                  style={{ color: GREEN_MEDIUM, borderColor: GREEN_MEDIUM }}
                  onClick={() => toggleGroup("engagementApproach")}
                >
                  {getGroupButtonLabel("engagementApproach")}
                </button>
              </div>
            </div>

            {expandedGroups.engagementApproach && (
              <div className="p-6 space-y-6">
                {/* Behaviors */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.behaviors}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Behaviors
                    </h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {personaData.engagementApproach.behaviors.items.map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                  <div
                    className="mt-4 p-3 rounded"
                    style={{
                      background: GREEN_BG,
                      borderLeft: `4px solid ${GREEN_DARK}`,
                    }}
                  >
                    <h4
                      className="font-medium mb-1"
                      style={{ color: GREEN_DARK }}
                    >
                      Content Marketing Implication
                    </h4>
                    <p className="text-gray-800">
                      {
                        personaData.engagementApproach.behaviors
                          .contentImplication
                      }
                    </p>
                  </div>
                </div>

                {/* Collaboration Insights */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.collaborationInsights}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Collaboration Insights
                    </h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {personaData.engagementApproach.collaborationInsights.items.map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                  <div
                    className="mt-4 p-3 rounded"
                    style={{
                      background: GREEN_BG,
                      borderLeft: `4px solid ${GREEN_DARK}`,
                    }}
                  >
                    <h4
                      className="font-medium mb-1"
                      style={{ color: GREEN_DARK }}
                    >
                      Content Marketing Implication
                    </h4>
                    <p className="text-gray-800">
                      {
                        personaData.engagementApproach.collaborationInsights
                          .contentImplication
                      }
                    </p>
                  </div>
                </div>

                {/* Problem Solving Method */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.problemSolving}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Problem Solving Method
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    {
                      personaData.engagementApproach.problemSolvingMethod
                        ?.description
                    }
                  </p>
                  <p className="text-gray-700 mt-2">
                    {personaData.engagementApproach.problemSolvingMethod?.value}
                  </p>
                </div>

                {/* Analogies */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.analogies}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Analogies
                    </h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {personaData.engagementApproach.analogies.items.map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                  <div
                    className="mt-4 p-3 rounded"
                    style={{
                      background: GREEN_BG,
                      borderLeft: `4px solid ${GREEN_DARK}`,
                    }}
                  >
                    <h4
                      className="font-medium mb-1"
                      style={{ color: GREEN_DARK }}
                    >
                      Content Marketing Implication
                    </h4>
                    <p className="text-gray-800">
                      {
                        personaData.engagementApproach.analogies
                          .contentImplication
                      }
                    </p>
                  </div>
                </div>

                {/* Messaging Angles - Only show if available */}
                {personaData.engagementApproach.messagingAngles && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      {sectionIcons.messagingAngles}
                      <h3
                        className="text-lg font-medium"
                        style={{ color: GREEN_DARK }}
                      >
                        Messaging Angles
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {
                        personaData.engagementApproach.messagingAngles
                          .description
                      }
                    </p>
                    <div className="space-y-3">
                      {personaData.engagementApproach.messagingAngles.items.map(
                        (item, idx) => (
                          <div
                            key={idx}
                            className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                          >
                            <p className="text-gray-800 font-medium">{item}</p>
                          </div>
                        )
                      )}
                    </div>
                    <div
                      className="mt-4 p-3 rounded"
                      style={{
                        background: GREEN_BG,
                        borderLeft: `4px solid ${GREEN_DARK}`,
                      }}
                    >
                      <h4
                        className="font-medium mb-1"
                        style={{ color: GREEN_DARK }}
                      >
                        Content Marketing Implication
                      </h4>
                      <p className="text-gray-800">
                        {
                          personaData.engagementApproach.messagingAngles
                            .contentImplication
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* === GROUP 5: Supporting Resources === */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h2
                    className="text-2xl font-bold flex items-center gap-2"
                    style={{ color: GREEN_DARK }}
                  >
                    <BookOpen size={24} className="text-[#003C2D]" />
                    5. Supporting Resources
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    References and additional resources for further learning
                  </p>
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-green-50 transition-all duration-200"
                  style={{ color: GREEN_MEDIUM, borderColor: GREEN_MEDIUM }}
                  onClick={() => toggleGroup("supportingResources")}
                >
                  {getGroupButtonLabel("supportingResources")}
                </button>
              </div>
            </div>

            {expandedGroups.supportingResources && (
              <div className="p-6 space-y-6">
                {/* References */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    {sectionIcons.references}
                    <h3
                      className="text-lg font-medium"
                      style={{ color: GREEN_DARK }}
                    >
                      Reference Sources
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {personaData.supportingResources.referenceSources.map(
                      (category, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <h4 className="font-medium text-gray-800 mb-2">
                            {category.Category}
                          </h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {category.Sources.map((source, sourceIdx) => (
                              <li key={sourceIdx}>
                                {source}
                                {category.URLs?.[sourceIdx] && (
                                  <a
                                    href={category.URLs[sourceIdx]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                  >
                                    (Link)
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div
          className="mt-8 p-6 rounded-xl border bg-[#f8faf9]"
          style={{ borderColor: GREEN_DARK }}
        >
          <div className="flex items-start gap-3">
            <HelpCircle size={20} className="text-[#003C2D] mt-1" />
            <div>
              <h3 className="font-semibold text-[#003C2D] mb-1">
                Experimental Version Note:
              </h3>
              <p className="text-sm text-gray-700">
                This is an experimental version of the Global Persona Template
                designed specifically for the content marketing team. The
                sections follow a natural storytelling flow to support content
                development - from basic understanding to specific messaging
                opportunities, content hooks, and engagement tactics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentalGlobalPersonaTemplate;

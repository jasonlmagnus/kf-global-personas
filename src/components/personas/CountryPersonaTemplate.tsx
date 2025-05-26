import React, { useState } from "react";
import { CountryPersona } from "../../types/personas";
import {
  Target, // User Goal Statement
  AlertTriangle, // Emotional Triggers, Pain Points
  Activity, // Key Responsibilities
  Users, // Collaboration Insights (general user icon)
  Globe, // Cultural Context (could also be MapPin)
  MessageSquare, // Quote
  ListChecks, // Needs (as a list of requirements)
  Users2, // Behaviors (as it's about people's actions)
  MapPin, // Regional Nuances
  GitCompareArrows, // Comparison to Generic CEO
  TrendingUp, // Motivations
  ChevronDown, // Collapse indicator
  ChevronRight, // Expand indicator
} from "lucide-react";

// Collapsible Section component
const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, icon, children, isExpanded, onToggle }) => (
  <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
    <h2
      className="text-xl font-semibold mb-3 text-gray-800 flex items-center cursor-pointer hover:text-teal-600 transition-colors"
      onClick={onToggle}
    >
      {icon && <span className="mr-2 text-teal-500">{icon}</span>}
      <span className="flex-1">{title}</span>
      <span className="ml-2 text-teal-500">
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </span>
    </h2>
    {isExpanded && (
      <div className="transition-all duration-200 ease-in-out">{children}</div>
    )}
  </div>
);

// Component to render a record where keys are categories and values are string arrays
const RecordListRenderer: React.FC<{
  record?: Record<string, string[] | string>; // Allow string for regionalNuances like items
}> = ({ record }) => {
  // Removed title prop
  if (!record || Object.keys(record).length === 0) {
    return <p className="text-sm text-gray-500">Not specified.</p>;
  }
  return (
    <div className="space-y-3">
      {Object.entries(record).map(([category, items]) => (
        <div
          key={category}
          className="mb-2 p-2 border-b border-gray-100 last:border-b-0"
        >
          <h3 className="text-md font-medium text-gray-700 mb-1">
            {category.replace(/_/g, " ")}
          </h3>
          {Array.isArray(items) ? (
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 pl-5">{String(items)}</p> // Indent single string items too
          )}
        </div>
      ))}
    </div>
  );
};

// Enhanced EmotionalTriggersList for structured display
const EmotionalTriggersList: React.FC<{ triggers?: string[] }> = ({
  triggers,
}) => {
  if (!triggers || triggers.length === 0) {
    return (
      <p className="text-sm text-gray-600">No emotional triggers listed.</p>
    );
  }

  // Parse structured triggers from concatenated strings
  const parseStructuredTrigger = (triggerString: string) => {
    // Check if it's in the format "Trigger: Response - Messaging: Implication"
    const match = triggerString.match(
      /^(.+?):\s*(.+?)\s*-\s*Messaging:\s*(.+)$/
    );
    if (match) {
      return {
        trigger: match[1].trim(),
        response: match[2].trim(),
        messaging: match[3].trim(),
      };
    }
    // Fallback for simple format
    return null;
  };

  return (
    <div className="space-y-3">
      {triggers.map((trigger, index) => {
        const structured = parseStructuredTrigger(trigger);

        if (structured) {
          // Display structured format
          return (
            <div
              key={index}
              className="p-3 bg-red-50 rounded border-l-4 border-red-400"
            >
              <h4 className="font-medium text-red-800">{structured.trigger}</h4>
              <p className="text-gray-600 mt-1">
                <strong>Response:</strong> {structured.response}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Messaging:</strong> {structured.messaging}
              </p>
            </div>
          );
        } else {
          // Display simple format
          return (
            <div
              key={index}
              className="p-2 bg-gray-50 rounded border-l-4 border-gray-400"
            >
              <p className="text-gray-700">{trigger}</p>
            </div>
          );
        }
      })}
    </div>
  );
};

// Component for Comparison to Generic CEO - Dynamic for any country
const ComparisonDisplay: React.FC<{
  items?: Array<Record<string, string>>;
  region: string;
}> = ({ items, region }) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-gray-500">No comparison data available.</p>
    );
  }

  // Helper function to format region name for display
  const formatRegionName = (reg: string): string => {
    if (reg === "aus") return "Australian";
    if (reg === "uk") return "UK";
    if (reg === "uae") return "UAE";
    return reg.charAt(0).toUpperCase() + reg.slice(1);
  };

  // Helper function to find the country-specific field dynamically
  const findCountryField = (item: Record<string, string>): string => {
    const regionName = formatRegionName(region);
    // Try different possible field name patterns
    const possibleKeys = [
      `${regionName} CEO Persona`,
      `${region.toUpperCase()} CEO Persona`,
      `Country Specific`,
      `Regional Specific`,
    ];

    for (const key of possibleKeys) {
      if (item[key]) return item[key];
    }

    // Fallback: find any field that contains "CEO Persona" but isn't "Generic"
    const ceoPersonaKey = Object.keys(item).find(
      (key) => key.includes("CEO Persona") && !key.includes("Generic")
    );
    return ceoPersonaKey ? item[ceoPersonaKey] : "Not specified";
  };

  // Helper function to find the value-add field dynamically
  const findValueAddField = (item: Record<string, string>): string => {
    const regionName = formatRegionName(region);
    // Try different possible field name patterns
    const possibleKeys = [
      `Value-Add for ${regionName} Context`,
      `Value-Add for ${region.toUpperCase()} Context`,
      `Value-Add`,
      `Regional Value-Add`,
    ];

    for (const key of possibleKeys) {
      if (item[key]) return item[key];
    }

    // Fallback: find any field that contains "Value-Add"
    const valueAddKey = Object.keys(item).find((key) =>
      key.includes("Value-Add")
    );
    return valueAddKey ? item[valueAddKey] : "Not specified";
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-md font-semibold text-indigo-600 mb-2">
            {item["Key Dimension"]}
          </h3>
          <p className="text-sm">
            <strong className="text-gray-600">Generic:</strong>{" "}
            {item["Generic CEO Persona"]}
          </p>
          <p className="text-sm">
            <strong className="text-gray-600">Country Specific:</strong>{" "}
            {findCountryField(item)}
          </p>
          <p className="text-sm">
            <strong className="text-gray-600">Value-Add:</strong>{" "}
            {findValueAddField(item)}
          </p>
        </div>
      ))}
    </div>
  );
};

interface CountryPersonaTemplateProps {
  persona: CountryPersona;
}

const CountryPersonaTemplate: React.FC<CountryPersonaTemplateProps> = ({
  persona,
}) => {
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    userGoalStatement: true, // Always open
    quote: false,
    needs: false,
    motivations: false,
    keyResponsibilities: false,
    painPoints: false,
    behaviors: false,
    emotionalTriggers: false,
    collaborationInsights: false,
    regionalNuances: false,
    culturalContext: false,
    comparison: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    if (section === "userGoalStatement") return; // Keep User Goal Statement always open
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!persona) {
    return <div className="p-4">Loading Country Persona data...</div>;
  }
  // console.log("DEBUG: CountryPersonaTemplate - persona:", JSON.stringify(persona, null, 2));

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{persona.title} ({persona.region.toUpperCase()})</h1> */}

        {persona.userGoalStatement && (
          <Section
            title="User Goal Statement"
            icon={<Target size={24} />}
            isExpanded={expandedSections.userGoalStatement}
            onToggle={() => toggleSection("userGoalStatement")}
          >
            <p className="text-gray-700 italic">{persona.userGoalStatement}</p>
          </Section>
        )}

        {persona.quote && (
          <Section
            title="Quote"
            icon={<MessageSquare size={24} />}
            isExpanded={expandedSections.quote}
            onToggle={() => toggleSection("quote")}
          >
            <p className="text-gray-600 italic">"{persona.quote}"</p>
          </Section>
        )}

        <Section
          title="Needs"
          icon={<ListChecks size={24} />}
          isExpanded={expandedSections.needs}
          onToggle={() => toggleSection("needs")}
        >
          <RecordListRenderer record={persona.needs} />
        </Section>

        <Section
          title="Motivations"
          icon={<TrendingUp size={24} />}
          isExpanded={expandedSections.motivations}
          onToggle={() => toggleSection("motivations")}
        >
          <RecordListRenderer record={persona.motivations} />
        </Section>

        <Section
          title="Key Responsibilities"
          icon={<Activity size={24} />}
          isExpanded={expandedSections.keyResponsibilities}
          onToggle={() => toggleSection("keyResponsibilities")}
        >
          <RecordListRenderer record={persona.keyResponsibilities} />
        </Section>

        <Section
          title="Frustrations / Pain Points"
          icon={<AlertTriangle size={24} />}
          isExpanded={expandedSections.painPoints}
          onToggle={() => toggleSection("painPoints")}
        >
          <RecordListRenderer record={persona.painPoints} />
        </Section>

        {persona.behaviors && Object.keys(persona.behaviors).length > 0 && (
          <Section
            title="Behaviors"
            icon={<Users2 size={24} />}
            isExpanded={expandedSections.behaviors}
            onToggle={() => toggleSection("behaviors")}
          >
            <RecordListRenderer record={persona.behaviors} />
          </Section>
        )}

        <Section
          title="Emotional Triggers"
          icon={<AlertTriangle size={24} />}
          isExpanded={expandedSections.emotionalTriggers}
          onToggle={() => toggleSection("emotionalTriggers")}
        >
          <EmotionalTriggersList triggers={persona.emotionalTriggers?.raw} />
        </Section>

        {persona.collaborationInsights &&
          Object.keys(persona.collaborationInsights).length > 0 && (
            <Section
              title="Collaboration Insights"
              icon={<Users size={24} />}
              isExpanded={expandedSections.collaborationInsights}
              onToggle={() => toggleSection("collaborationInsights")}
            >
              <RecordListRenderer record={persona.collaborationInsights} />
            </Section>
          )}

        {persona.regionalNuances &&
          Object.keys(persona.regionalNuances).length > 0 && (
            <Section
              title="Regional Nuances"
              icon={<MapPin size={24} />}
              isExpanded={expandedSections.regionalNuances}
              onToggle={() => toggleSection("regionalNuances")}
            >
              {/* Casting to Record<string, string> for RecordListRenderer which expects string[] or string */}
              <RecordListRenderer
                record={persona.regionalNuances as Record<string, string>}
              />
            </Section>
          )}

        {persona.culturalContext && (
          <Section
            title="Cultural Context"
            icon={<Globe size={24} />}
            isExpanded={expandedSections.culturalContext}
            onToggle={() => toggleSection("culturalContext")}
          >
            <p className="text-gray-600">{persona.culturalContext}</p>
          </Section>
        )}

        {persona.comparison && persona.comparison.length > 0 && (
          <Section
            title={`Comparison to Generic CEO (${persona.region.toUpperCase()})`}
            icon={<GitCompareArrows size={24} />}
            isExpanded={expandedSections.comparison}
            onToggle={() => toggleSection("comparison")}
          >
            <ComparisonDisplay
              items={persona.comparison}
              region={persona.region}
            />
          </Section>
        )}
      </div>
    </div>
  );
};

export default CountryPersonaTemplate;

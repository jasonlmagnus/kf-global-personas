import React from "react";
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
} from "lucide-react";

// Main Section component (can be moved to a shared utils file later)
const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
    <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
      {icon && <span className="mr-2 text-teal-500">{icon}</span>}{" "}
      {/* Changed icon color for country */}
      {title}
    </h2>
    {children}
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

// Generic EmotionalTriggersList (same as in GlobalPersonaTemplate)
const EmotionalTriggersList: React.FC<{ triggers?: string[] }> = ({
  triggers,
}) => {
  if (!triggers || triggers.length === 0) {
    return (
      <p className="text-sm text-gray-600">No emotional triggers listed.</p>
    );
  }
  return (
    <ul className="list-disc list-inside space-y-1 text-gray-700">
      {triggers.map((trigger, index) => (
        <li key={index}>{trigger}</li>
      ))}
    </ul>
  );
};

// Component for Comparison to Generic CEO
const ComparisonDisplay: React.FC<{
  items?: Array<{
    "Key Dimension": string;
    "Generic CEO Persona": string;
    "Australian CEO Persona": string; // This will need to be dynamic if used for other countries
    "Value-Add for Australian Context": string; // Same as above
  }>;
}> = ({ items }) => {
  // Removed title prop
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-gray-500">No comparison data available.</p>
    );
  }
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
            {/* TODO: Make "Australian CEO" dynamic based on persona.region */}
            <strong className="text-gray-600">Country Specific:</strong>{" "}
            {item["Australian CEO Persona"]}
          </p>
          <p className="text-sm">
            {/* TODO: Make "Value-Add for Australian Context" dynamic */}
            <strong className="text-gray-600">Value-Add:</strong>{" "}
            {item["Value-Add for Australian Context"]}
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
  if (!persona) {
    return <div className="p-4">Loading Country Persona data...</div>;
  }
  // console.log("DEBUG: CountryPersonaTemplate - persona:", JSON.stringify(persona, null, 2));

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{persona.title} ({persona.region.toUpperCase()})</h1> */}

        {persona.userGoalStatement && (
          <Section title="User Goal Statement" icon={<Target size={24} />}>
            <p className="text-gray-700 italic">{persona.userGoalStatement}</p>
          </Section>
        )}

        {persona.quote && (
          <Section title="Quote" icon={<MessageSquare size={24} />}>
            <p className="text-gray-600 italic">"{persona.quote}"</p>
          </Section>
        )}

        <Section title="Needs" icon={<ListChecks size={24} />}>
          <RecordListRenderer record={persona.needs} />
        </Section>

        <Section title="Motivations" icon={<TrendingUp size={24} />}>
          <RecordListRenderer record={persona.motivations} />
        </Section>

        <Section title="Key Responsibilities" icon={<Activity size={24} />}>
          <RecordListRenderer record={persona.keyResponsibilities} />
        </Section>

        <Section
          title="Frustrations / Pain Points"
          icon={<AlertTriangle size={24} />}
        >
          <RecordListRenderer record={persona.painPoints} />
        </Section>

        {persona.behaviors && Object.keys(persona.behaviors).length > 0 && (
          <Section title="Behaviors" icon={<Users2 size={24} />}>
            <RecordListRenderer record={persona.behaviors} />
          </Section>
        )}

        {persona.collaborationInsights &&
          Object.keys(persona.collaborationInsights).length > 0 && (
            <Section title="Collaboration Insights" icon={<Users size={24} />}>
              <RecordListRenderer record={persona.collaborationInsights} />
            </Section>
          )}

        <Section title="Emotional Triggers" icon={<AlertTriangle size={24} />}>
          <EmotionalTriggersList triggers={persona.emotionalTriggers?.raw} />
        </Section>

        {persona.regionalNuances &&
          Object.keys(persona.regionalNuances).length > 0 && (
            <Section title="Regional Nuances" icon={<MapPin size={24} />}>
              {/* Casting to Record<string, string> for RecordListRenderer which expects string[] or string */}
              <RecordListRenderer
                record={persona.regionalNuances as Record<string, string>}
              />
            </Section>
          )}

        {persona.culturalContext && (
          <Section title="Cultural Context" icon={<Globe size={24} />}>
            <p className="text-gray-600">{persona.culturalContext}</p>
          </Section>
        )}

        {persona.comparison && persona.comparison.length > 0 && (
          <Section
            title={`Comparison to Generic CEO (${persona.region.toUpperCase()})`}
            icon={<GitCompareArrows size={24} />}
          >
            <ComparisonDisplay items={persona.comparison} />
          </Section>
        )}
      </div>
    </div>
  );
};

export default CountryPersonaTemplate;

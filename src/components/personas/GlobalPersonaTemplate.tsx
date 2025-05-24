import React from "react";
import { GlobalPersona } from "../../types/personas";
import {
  Target,
  AlertTriangle,
  Activity,
  Users,
  Globe,
  HelpCircle,
  MessageSquare,
  Search,
  TrendingUp,
  BarChart3,
  Lightbulb,
  BookOpen,
  FileText,
  Briefcase,
  Users2,
  Eye,
  ListChecks,
} from "lucide-react";

// Helper component to render a list of strings
const StringList: React.FC<{ items?: string[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">Not specified.</p>;
  }
  return (
    <ul className="list-disc pl-6 space-y-1 text-gray-600">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

// Helper component to render an array of objects with Category and Description
const CategoryDescriptionList: React.FC<{
  items?: Array<{ Category: string; Description: string }>;
}> = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">No items listed.</p>;
  }
  return (
    <ul className="list-none pl-0 space-y-2 text-gray-600">
      {items.map((item, index) => (
        <li key={index} className="p-2 border-b border-gray-100">
          <strong className="text-gray-700">{item.Category}:</strong>{" "}
          {item.Description}
        </li>
      ))}
    </ul>
  );
};

// Helper component to render emotional triggers
const EmotionalTriggersList: React.FC<{ triggers?: string[] }> = ({
  triggers,
}) => {
  if (!triggers || triggers.length === 0) {
    return <p className="text-gray-600">No emotional triggers listed.</p>;
  }
  return (
    <ul className="list-disc list-inside space-y-1">
      {triggers.map((trigger, index) => (
        <li key={index} className="text-gray-700">
          {trigger}
        </li>
      ))}
    </ul>
  );
};

// Component for Perception Gaps
const PerceptionGapsDisplay: React.FC<{
  items?: Array<{
    Area: string;
    Gap: string;
    Business_Impact: string;
    Opportunity: string;
  }>;
}> = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">No perception gaps listed.</p>;
  }
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-orange-600">{item.Area}</h3>
          <p>
            <strong className="text-gray-600">Gap:</strong> {item.Gap}
          </p>
          <p>
            <strong className="text-gray-600">Business Impact:</strong>{" "}
            {item.Business_Impact}
          </p>
          <p>
            <strong className="text-gray-600">Opportunity:</strong>{" "}
            {item.Opportunity}
          </p>
        </div>
      ))}
    </div>
  );
};

// Component for Connection Opportunities
const ConnectionOpportunitiesDisplay: React.FC<{
  items?: Array<{ Area: string; Finding: string; Leverage_Point: string }>;
}> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No connection opportunities listed.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-blue-50 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-blue-600">{item.Area}</h3>
          <p>
            <strong className="text-gray-600">Finding:</strong> {item.Finding}
          </p>
          <p>
            <strong className="text-gray-600">Leverage Point:</strong>{" "}
            {item.Leverage_Point}
          </p>
        </div>
      ))}
    </div>
  );
};

// Main Section component
const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
    <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
      {icon && <span className="mr-2 text-blue-500">{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);

interface GlobalPersonaTemplateProps {
  persona: GlobalPersona;
}

const GlobalPersonaTemplate: React.FC<GlobalPersonaTemplateProps> = ({
  persona,
}) => {
  if (!persona) {
    return <div className="p-4">Loading Global Persona data...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {persona.roleOverview && (
          <Section title="Role Overview" icon={<Briefcase size={24} />}>
            <p className="text-gray-700 leading-relaxed">
              {persona.roleOverview}
            </p>
          </Section>
        )}

        <Section title="Goal Statement" icon={<Target size={24} />}>
          <p className="text-gray-700 italic">"{persona.goalStatement}"</p>
        </Section>

        <Section title="Key Responsibilities" icon={<Activity size={24} />}>
          <CategoryDescriptionList items={persona.keyResponsibilities} />
        </Section>

        {persona.keyRelationships && persona.keyRelationships.length > 0 && (
          <Section title="Key Relationships" icon={<Users2 size={24} />}>
            <StringList items={persona.keyRelationships} />
          </Section>
        )}

        {persona.uniquePerspective && (
          <Section title="Unique Perspective" icon={<Eye size={24} />}>
            <p className="text-gray-700 leading-relaxed">
              {persona.uniquePerspective}
            </p>
          </Section>
        )}

        {persona.kpis && persona.kpis.length > 0 && (
          <Section title="KPIs" icon={<ListChecks size={24} />}>
            <StringList items={persona.kpis} />
          </Section>
        )}

        <Section title="Needs" icon={<HelpCircle size={24} />}>
          <CategoryDescriptionList items={persona.needs} />
        </Section>

        <Section title="Emotional Triggers" icon={<AlertTriangle size={24} />}>
          <EmotionalTriggersList triggers={persona.emotionalTriggers?.raw} />
        </Section>

        <Section title="Motivations" icon={<TrendingUp size={24} />}>
          <StringList items={persona.motivations} />
        </Section>

        <Section title="Perception Gaps" icon={<Search size={24} />}>
          <PerceptionGapsDisplay items={persona.perceptionGaps} />
        </Section>

        <Section
          title="Connection Opportunities"
          icon={<MessageSquare size={24} />}
        >
          <ConnectionOpportunitiesDisplay
            items={persona.connectionOpportunities}
          />
        </Section>

        <Section title="Knowledge or Expertise" icon={<BookOpen size={24} />}>
          <StringList items={persona.knowledgeOrExpertise} />
        </Section>

        <Section title="Analogies" icon={<Lightbulb size={24} />}>
          <StringList items={persona.analogies} />
        </Section>

        {persona.referenceSources && persona.referenceSources.length > 0 && (
          <Section title="Reference Sources" icon={<FileText size={24} />}>
            <StringList items={persona.referenceSources} />
          </Section>
        )}

        {persona.problemSolvingMethod && (
          <Section
            title="Problem Solving Method"
            icon={<Lightbulb size={24} />}
          >
            <p className="text-gray-700">{persona.problemSolvingMethod}</p>
          </Section>
        )}
      </div>
    </div>
  );
};

export default GlobalPersonaTemplate;

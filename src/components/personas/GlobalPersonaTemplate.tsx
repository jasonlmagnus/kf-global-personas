import React, { useState } from "react";
import { GlobalPersonaV3 } from "../../types/personas";
import {
  Briefcase,
  Target,
  Eye,
  Activity,
  BookOpen,
  MessageSquare,
  TrendingUp,
  HelpCircle,
  Search,
  AlertTriangle,
  Users2,
  Lightbulb,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Color constants for Korn Ferry branding
const GREEN_BG = "#E8F5E8";
const GREEN_DARK = "#2D5A2D";
const KF_BLUE = "#003C2D";
const KF_ORANGE = "#FF6B00";
const KF_RED = "#B91C1C";

// Section icons
const sectionIcons = {
  role: <Briefcase size={20} className="text-[#003C2D] mr-2" />,
  userGoalStatement: <Target size={20} className="text-[#003C2D] mr-2" />,
  coreBelief: <Eye size={20} className="text-[#003C2D] mr-2" />,
  responsibilities: <Activity size={20} className="text-[#003C2D] mr-2" />,
  knowledge: <BookOpen size={20} className="text-[#003C2D] mr-2" />,
  connectionOpportunities: (
    <MessageSquare size={20} className="text-[#FF6B00] mr-2" />
  ),
  motivations: <TrendingUp size={20} className="text-[#FF6B00] mr-2" />,
  needs: <HelpCircle size={20} className="text-[#FF6B00] mr-2" />,
  perceptionGaps: <Search size={20} className="text-[#B91C1C] mr-2" />,
  frustrations: <AlertTriangle size={20} className="text-[#B91C1C] mr-2" />,
  emotionalTriggers: (
    <AlertTriangle size={20} className="text-[#B91C1C] mr-2" />
  ),
  behaviors: <Users2 size={20} className="text-[#6B46C1] mr-2" />,
  collaborationInsights: (
    <Lightbulb size={20} className="text-[#6B46C1] mr-2" />
  ),
  analogies: <FileText size={20} className="text-[#6B46C1] mr-2" />,
};

// Content Implication Component
const ContentImplication: React.FC<{ text: string }> = ({ text }) => (
  <div
    className="mt-4 p-3 rounded"
    style={{ background: GREEN_BG, borderLeft: `4px solid ${GREEN_DARK}` }}
  >
    <h4 className="font-medium mb-1" style={{ color: GREEN_DARK }}>
      Content Marketing Implication
    </h4>
    <p className="text-gray-800">{text}</p>
  </div>
);

// Data Source Badge Component
const DataSourceBadge: React.FC<{ source?: string }> = ({ source }) => {
  if (!source) return null;
  return (
    <span className="text-xs text-gray-500 ml-2 px-2 py-1 bg-gray-100 rounded">
      ({source})
    </span>
  );
};

// Expandable Group Component
const ExpandableGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  color: string;
}> = ({ title, icon, isExpanded, onToggle, children, color }) => (
  <div className="mb-6 border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center">
        {icon}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {isExpanded ? (
        <ChevronUp size={20} className="text-gray-500" />
      ) : (
        <ChevronDown size={20} className="text-gray-500" />
      )}
    </button>
    {isExpanded && (
      <div
        className="p-4 border-t border-gray-100"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        {children}
      </div>
    )}
  </div>
);

// Section Component
const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
    <h3 className="text-lg font-medium mb-3 text-gray-800 flex items-center">
      {icon}
      {title}
    </h3>
    <div className="ml-7">{children}</div>
  </div>
);

// List Components
const StringList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc pl-6 space-y-1 text-gray-600">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

const CategoryDescriptionList: React.FC<{
  items: Array<{ Category: string; Description: string }>;
}> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="pb-3 border-b border-gray-200 last:border-b-0"
        >
          <h4 className="font-medium text-gray-800 mb-2">{item.Category}</h4>
          <p className="text-gray-600">{item.Description}</p>
        </div>
      ))}
    </div>
  );
};

const ConnectionOpportunitiesList: React.FC<{
  items: Array<{
    Area: string;
    Finding: string;
    Leverage_Point: string;
    dataSource?: string;
  }>;
}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="pb-4 border-b border-gray-200 last:border-b-0"
        >
          <h4 className="font-medium text-gray-800 flex items-center mb-2">
            {item.Area}
            <DataSourceBadge source={item.dataSource} />
          </h4>
          <p className="text-gray-600 mb-2">
            <strong>Finding:</strong> {item.Finding}
          </p>
          <p className="text-gray-600">
            <strong>Leverage Point:</strong> {item.Leverage_Point}
          </p>
        </div>
      ))}
    </div>
  );
};

const PerceptionGapsList: React.FC<{
  items: Array<{
    Area: string;
    Gap: string;
    Business_Impact: string;
    Opportunity: string;
    dataSource?: string;
  }>;
}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="pb-4 border-b border-gray-200 last:border-b-0"
        >
          <h4 className="font-medium text-gray-800 flex items-center mb-2">
            {item.Area}
            <DataSourceBadge source={item.dataSource} />
          </h4>
          <p className="text-gray-600 mb-2">
            <strong>Gap:</strong> {item.Gap}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Business Impact:</strong> {item.Business_Impact}
          </p>
          <p className="text-gray-600">
            <strong>Opportunity:</strong> {item.Opportunity}
          </p>
        </div>
      ))}
    </div>
  );
};

const EmotionalTriggersList: React.FC<{
  items: Array<{
    Trigger: string;
    Emotional_Response: string;
    Messaging_Implication: string;
  }>;
}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="pb-4 border-b border-gray-200 last:border-b-0"
        >
          <h4 className="font-medium text-gray-800 mb-2">{item.Trigger}</h4>
          <p className="text-gray-600 mb-2">
            <strong>Response:</strong> {item.Emotional_Response}
          </p>
          <p className="text-gray-600">
            <strong>Messaging:</strong> {item.Messaging_Implication}
          </p>
        </div>
      ))}
    </div>
  );
};

const ReferenceSources: React.FC<{
  items: Array<{
    Category: string;
    Sources: string[];
    URLs?: string[];
  }>;
}> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="pb-4 border-b border-gray-200 last:border-b-0"
        >
          <h4 className="font-medium text-gray-800 mb-3">{item.Category}</h4>
          <ul className="list-disc pl-6 space-y-1">
            {item.Sources.map((source, sourceIndex) => (
              <li key={sourceIndex} className="text-gray-600">
                {source}
                {item.URLs && item.URLs[sourceIndex] && (
                  <a
                    href={item.URLs[sourceIndex]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    (link)
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

interface GlobalPersonaTemplateProps {
  persona: GlobalPersonaV3;
}

const GlobalPersonaTemplate: React.FC<GlobalPersonaTemplateProps> = ({
  persona,
}) => {
  const [expandedGroups, setExpandedGroups] = useState({
    coreUnderstanding: false,
    strategicValuePoints: false,
    painPointsAndChallenges: false,
    engagementApproach: false,
    supportingResources: false,
  });

  if (!persona) {
    return <div className="p-4">Loading Global Persona data...</div>;
  }

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const expandAll = () => {
    setExpandedGroups({
      coreUnderstanding: true,
      strategicValuePoints: true,
      painPointsAndChallenges: true,
      engagementApproach: true,
      supportingResources: true,
    });
  };

  const collapseAll = () => {
    setExpandedGroups({
      coreUnderstanding: false,
      strategicValuePoints: false,
      painPointsAndChallenges: false,
      engagementApproach: false,
      supportingResources: false,
    });
  };

  const expandedCount = Object.values(expandedGroups).filter(Boolean).length;
  const totalGroups = Object.keys(expandedGroups).length;
  const progressPercentage = (expandedCount / totalGroups) * 100;

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {persona.coreUnderstanding.core.role}
        </h1>
        <p className="text-gray-600">
          Version {persona.metadata.version} • Last updated:{" "}
          {persona.metadata.lastUpdated}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {expandedCount}/{totalGroups} sections expanded
          </span>
          <div className="space-x-2">
            <button
              onClick={expandAll}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Collapse All
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Core Understanding Group */}
      <ExpandableGroup
        title="Core Understanding"
        icon={<Briefcase size={24} className="text-[#003C2D] mr-3" />}
        isExpanded={expandedGroups.coreUnderstanding}
        onToggle={() => toggleGroup("coreUnderstanding")}
        color={KF_BLUE}
      >
        <Section title="Role" icon={sectionIcons.role}>
          <p className="text-gray-700 font-medium">
            {persona.coreUnderstanding.core.role}
          </p>
        </Section>

        <Section
          title="User Goal Statement"
          icon={sectionIcons.userGoalStatement}
        >
          <p className="text-gray-700 italic">
            "{persona.coreUnderstanding.core.userGoalStatement}"
          </p>
          <ContentImplication
            text={persona.coreUnderstanding.core.contentImplication}
          />
        </Section>

        <Section title="Core Belief" icon={sectionIcons.coreBelief}>
          <p className="text-gray-700">
            {persona.coreUnderstanding.core.coreBelief}
          </p>
        </Section>

        <Section
          title="Key Responsibilities"
          icon={sectionIcons.responsibilities}
        >
          <CategoryDescriptionList
            items={persona.coreUnderstanding.responsibilities.items}
          />
          <ContentImplication
            text={persona.coreUnderstanding.responsibilities.contentImplication}
          />
        </Section>

        <Section title="Knowledge Areas" icon={sectionIcons.knowledge}>
          <StringList items={persona.coreUnderstanding.knowledge.items} />
          <ContentImplication
            text={persona.coreUnderstanding.knowledge.contentImplication}
          />
        </Section>
      </ExpandableGroup>

      {/* Strategic Value Points Group */}
      <ExpandableGroup
        title="Strategic Value Points"
        icon={<TrendingUp size={24} className="text-[#FF6B00] mr-3" />}
        isExpanded={expandedGroups.strategicValuePoints}
        onToggle={() => toggleGroup("strategicValuePoints")}
        color={KF_ORANGE}
      >
        <Section
          title="Connection Opportunities"
          icon={sectionIcons.connectionOpportunities}
        >
          <ConnectionOpportunitiesList
            items={persona.strategicValuePoints.connectionOpportunities.items}
          />
          <ContentImplication
            text={
              persona.strategicValuePoints.connectionOpportunities
                .contentImplication
            }
          />
        </Section>

        <Section title="Motivations" icon={sectionIcons.motivations}>
          <StringList items={persona.strategicValuePoints.motivations.items} />
          <ContentImplication
            text={persona.strategicValuePoints.motivations.contentImplication}
          />
        </Section>

        <Section title="Needs" icon={sectionIcons.needs}>
          <CategoryDescriptionList
            items={persona.strategicValuePoints.needs.items}
          />
          <ContentImplication
            text={persona.strategicValuePoints.needs.contentImplication}
          />
        </Section>
      </ExpandableGroup>

      {/* Pain Points and Challenges Group */}
      <ExpandableGroup
        title="Pain Points & Challenges"
        icon={<AlertTriangle size={24} className="text-[#B91C1C] mr-3" />}
        isExpanded={expandedGroups.painPointsAndChallenges}
        onToggle={() => toggleGroup("painPointsAndChallenges")}
        color={KF_RED}
      >
        <Section title="Perception Gaps" icon={sectionIcons.perceptionGaps}>
          <PerceptionGapsList
            items={persona.painPointsAndChallenges.perceptionGaps.items}
          />
          <ContentImplication
            text={
              persona.painPointsAndChallenges.perceptionGaps.contentImplication
            }
          />
        </Section>

        <Section title="Frustrations" icon={sectionIcons.frustrations}>
          <StringList
            items={persona.painPointsAndChallenges.frustrations.items}
          />
          <ContentImplication
            text={
              persona.painPointsAndChallenges.frustrations.contentImplication
            }
          />
        </Section>

        <Section
          title="Emotional Triggers"
          icon={sectionIcons.emotionalTriggers}
        >
          <EmotionalTriggersList
            items={persona.painPointsAndChallenges.emotionalTriggers.items}
          />
          <ContentImplication
            text={
              persona.painPointsAndChallenges.emotionalTriggers
                .contentImplication
            }
          />
        </Section>
      </ExpandableGroup>

      {/* Engagement Approach Group */}
      <ExpandableGroup
        title="Engagement Approach"
        icon={<Users2 size={24} className="text-[#6B46C1] mr-3" />}
        isExpanded={expandedGroups.engagementApproach}
        onToggle={() => toggleGroup("engagementApproach")}
        color="#6B46C1"
      >
        <Section title="Behaviors" icon={sectionIcons.behaviors}>
          <StringList items={persona.engagementApproach.behaviors.items} />
          <ContentImplication
            text={persona.engagementApproach.behaviors.contentImplication}
          />
        </Section>

        <Section
          title="Collaboration Insights"
          icon={sectionIcons.collaborationInsights}
        >
          <StringList
            items={persona.engagementApproach.collaborationInsights.items}
          />
          <ContentImplication
            text={
              persona.engagementApproach.collaborationInsights
                .contentImplication
            }
          />
        </Section>

        <Section
          title="Problem Solving Method"
          icon={<Lightbulb size={20} className="text-[#6B46C1] mr-2" />}
        >
          <p className="text-gray-700">
            {persona.engagementApproach.problemSolvingMethod.value}
          </p>
        </Section>

        <Section title="Analogies" icon={sectionIcons.analogies}>
          <StringList items={persona.engagementApproach.analogies.items} />
          <ContentImplication
            text={persona.engagementApproach.analogies.contentImplication}
          />
        </Section>
      </ExpandableGroup>

      {/* Supporting Resources Group */}
      <ExpandableGroup
        title="Supporting Resources"
        icon={<BookOpen size={24} className="text-[#059669] mr-3" />}
        isExpanded={expandedGroups.supportingResources}
        onToggle={() => toggleGroup("supportingResources")}
        color="#059669"
      >
        <Section
          title="Reference Sources"
          icon={<FileText size={20} className="text-[#059669] mr-2" />}
        >
          <ReferenceSources
            items={persona.supportingResources.referenceSources}
          />
        </Section>
      </ExpandableGroup>
    </div>
  );
};

export default GlobalPersonaTemplate;

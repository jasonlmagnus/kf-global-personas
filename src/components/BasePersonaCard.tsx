import React from "react";
import { User, Quote } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { BulletList } from "./BulletList";

interface BasePersonaCardProps {
  title: string;
  subtitle: string;
  goalStatement: string;
  quote?: string;
  sections: {
    icon: React.ElementType;
    title: string;
    color: string;
    items: string[];
  }[];
  insights: string[];
}

export default function BasePersonaCard({
  title,
  subtitle,
  goalStatement,
  quote,
  sections,
  insights,
}: BasePersonaCardProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>
          <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
            User Goal Statement
          </h3>
          <p className="text-gray-700 italic">{goalStatement}</p>
        </div>

        {quote && (
          <div className="flex items-start space-x-2 text-gray-700">
            <Quote className="h-5 w-5 flex-shrink-0 text-blue-500" />
            <p className="italic">{quote}</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <SectionCard
            key={index}
            icon={section.icon}
            title={section.title}
            color={section.color}
          >
            <BulletList items={section.items} />
          </SectionCard>
        ))}
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">
          Relevant Insights for Teams
        </h2>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-gray-50 rounded-lg"
            >
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0" />
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

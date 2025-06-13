"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface Persona {
  id: string;
  title: string;
  role: string;
  summary: string;
  name: string;
  age: number;
  pronouns: string;
  education: string;
  jobTitle: string;
  reportsTo: string;
  directReports?: number;
  responsibilities: string[];
  goals: string[];
  challenges: string[];
  communicationStyle: string;
  preferredChannels: string[];
  tools: string[];
  quote: string;
  imageUrl: string;
  drivers: string[];
  competencies: string[];
  traits: string[];
  talkingPoints: string[];
  objections: string[];
  idealContentFormats: string[];
  idealContentTopics: string[];
}

interface PageParams {
  id: string;
}

const PersonaDetailPage = ({ params }: { params: PageParams }) => {
  const { theme, isLoading: isThemeLoading } = useTheme();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetchPersona = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/data/${params.id}.json`);
          if (!response.ok) {
            throw new Error("Persona not found");
          }
          const data: Persona = await response.json();
          setPersona(data);
        } catch (err) {
          setError("Failed to load persona data.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPersona();
    }
  }, [params.id]);

  if (isThemeLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!persona) {
    return <div className="text-center py-10">No persona data available.</div>;
  }

  return (
    <div
      className="p-4 md:p-8 lg:p-12"
      style={{ fontFamily: theme?.typography.fontFamily }}
    >
      <h1
        className="text-4xl font-bold mb-4"
        style={{ color: theme?.colors.primary }}
      >
        {persona.title}
      </h1>
      <p className="text-lg italic mb-8">"{persona.quote}"</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src={persona.imageUrl}
            alt={persona.name}
            className="rounded-lg shadow-lg w-full"
          />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h2
              className="text-2xl font-semibold"
              style={{ color: theme?.colors.secondary }}
            >
              {persona.name}
            </h2>
            <p>{persona.jobTitle}</p>
            <p>
              {persona.age} years old, {persona.pronouns}
            </p>
            <hr className="my-4" />
            <p>
              <strong>Education:</strong> {persona.education}
            </p>
            <p>
              <strong>Reports to:</strong> {persona.reportsTo}
            </p>
            {persona.directReports && (
              <p>
                <strong>Direct Reports:</strong> {persona.directReports}
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="prose max-w-none">
            <h3 style={{ color: theme?.colors.secondary }}>Summary</h3>
            <p>{persona.summary}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 style={{ color: theme?.colors.secondary }}>Goals</h3>
                <ul className="list-disc pl-5">
                  {persona.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ color: theme?.colors.secondary }}>Challenges</h3>
                <ul className="list-disc pl-5">
                  {persona.challenges.map((challenge, i) => (
                    <li key={i}>{challenge}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ color: theme?.colors.secondary }}>
                  Drives & Competencies
                </h3>
                <ul className="list-disc pl-5">
                  {persona.drivers.map((driver, i) => (
                    <li key={i}>{driver}</li>
                  ))}
                  {persona.competencies.map((comp, i) => (
                    <li key={i}>{comp}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ color: theme?.colors.secondary }}>
                  Talking Points
                </h3>
                <ul className="list-disc pl-5">
                  {persona.talkingPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaDetailPage;

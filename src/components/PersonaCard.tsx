import {
  Heart,
  AlertCircle,
  ClipboardList,
  Activity,
  Target,
} from "lucide-react";
import BasePersonaCard from "./BasePersonaCard";
import {
  Persona,
  GlobalPersona,
  CountryPersona,
  isGlobalPersona,
} from "../types/personas";

interface PersonaCardProps {
  persona: Persona;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  const sections = [
    {
      icon: Target,
      title: "Needs",
      color: "text-blue-600",
      items: persona.needs || [],
    },
    {
      icon: Heart,
      title: "Motivations",
      color: "text-red-600",
      items: persona.motivations || [],
    },
    {
      icon: AlertCircle,
      title: "Frustrations / Pain Points",
      color: "text-amber-600",
      items: persona.painPoints || [],
    },
    {
      icon: ClipboardList,
      title: "Key Responsibilities",
      color: "text-purple-600",
      items: persona.keyResponsibilities || [],
    },
    {
      icon: Activity,
      title: "Behaviors",
      color: "text-green-600",
      items: persona.behaviors || [],
    },
  ];

  let goalStatement = "";
  if (isGlobalPersona(persona)) {
    goalStatement = persona.goalStatement;
  } else {
    goalStatement = persona.userGoalStatement;
  }

  return (
    <BasePersonaCard
      title={persona.title}
      subtitle={persona.department}
      goalStatement={goalStatement}
      quote={persona.quote}
      sections={sections.filter(
        (section) => section.items && section.items.length > 0
      )}
      insights={persona.collaborationInsights || []}
    />
  );
}

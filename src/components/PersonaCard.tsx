import { Heart, AlertCircle, ClipboardList, Activity, Target } from 'lucide-react';
import BasePersonaCard from './BasePersonaCard';
import { Persona } from '../types/Persona';

interface PersonaCardProps {
  persona: Persona;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  const sections = [
    {
      icon: Target,
      title: 'Needs',
      color: 'text-blue-600',
      items: persona.needs,
    },
    {
      icon: Heart,
      title: 'Motivations',
      color: 'text-red-600',
      items: persona.motivations,
    },
    {
      icon: AlertCircle,
      title: 'Frustrations / Pain Points',
      color: 'text-amber-600',
      items: persona.painPoints,
    },
    {
      icon: ClipboardList,
      title: 'Key Responsibilities',
      color: 'text-purple-600',
      items: persona.responsibilities,
    },
    {
      icon: Activity,
      title: 'Behaviors',
      color: 'text-green-600',
      items: persona.behaviors,
    },
  ];

  return (
    <BasePersonaCard
      title={persona.title}
      subtitle={persona.department}
      goalStatement={persona.goalStatement}
      quote={persona.quote}
      sections={sections}
      insights={persona.insights}
    />
  );
}
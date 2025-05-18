import React from "react";
import { Persona } from "../../types/personas";
import PersonaSummaryCard from "./PersonaSummaryCard";

interface PersonaListProps {
  personas: Persona[];
  viewType: "role" | "region"; // Specific to current use cases
  onPersonaClick: (persona: Persona) => void;
  selectedDetailPersonaId: string | null;
}

const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  viewType,
  onPersonaClick,
  selectedDetailPersonaId,
}) => {
  if (!personas || personas.length === 0) {
    return <p>No personas to display.</p>; // Or some other placeholder
  }

  const gridClass =
    viewType === "role" ? "persona-role-grid" : "persona-nav-grid";

  return (
    <div className={gridClass}>
      {personas.map((p) => (
        <PersonaSummaryCard
          key={p.id}
          persona={p}
          viewType={viewType}
          isSelected={selectedDetailPersonaId === p.id}
          onClick={() => onPersonaClick(p)}
        />
      ))}
    </div>
  );
};

export default PersonaList;

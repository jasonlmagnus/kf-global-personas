import React from "react";
import { Persona } from "@/types/personas";
import { formatDepartmentName } from "@/lib/personaUtils";
import { ArrowRight } from "lucide-react";

interface PersonaSummaryCardProps {
  persona: Persona;
  onSelect: (persona: Persona) => void;
}

const PersonaSummaryCard: React.FC<PersonaSummaryCardProps> = ({
  persona,
  onSelect,
}) => {
  const departmentName = formatDepartmentName(persona.department);
  const regionName = persona.region.toUpperCase();

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-500 border-2 border-transparent"
      onClick={() => onSelect(persona)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) =>
        (e.key === "Enter" || e.key === " ") && onSelect(persona)
      }
    >
      <h3 className="text-xl font-bold text-gray-800 mb-1">{persona.title}</h3>
      <p className="text-sm text-gray-500 mb-6">{`${regionName} - ${departmentName}`}</p>
      <div className="flex items-center text-blue-600 font-semibold group">
        View Details
        <ArrowRight
          size={16}
          className="ml-2 transform transition-transform group-hover:translate-x-1"
        />
      </div>
    </div>
  );
};

export default PersonaSummaryCard;

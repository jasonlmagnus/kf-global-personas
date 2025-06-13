import React from "react";
import { Persona } from "@/types/personas";
import { formatDepartmentName } from "@/lib/personaUtils";
import { ArrowRight, Trash2 } from "lucide-react";

interface PersonaSummaryCardProps {
  persona: Persona;
  onSelect: (persona: Persona) => void;
  onDelete: (persona: Persona) => void;
}

const PersonaSummaryCard: React.FC<PersonaSummaryCardProps> = ({
  persona,
  onSelect,
  onDelete,
}) => {
  const departmentName = formatDepartmentName(persona.department);
  const regionName = persona.region.toUpperCase();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the onSelect from being called
    if (
      window.confirm(
        `Are you sure you want to delete the persona "${persona.title}"?`
      )
    ) {
      onDelete(persona);
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary border-2 border-transparent relative group/card"
      onClick={() => onSelect(persona)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) =>
        (e.key === "Enter" || e.key === " ") && onSelect(persona)
      }
    >
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 text-gray-500 opacity-0 group-hover/card:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
        aria-label={`Delete ${persona.title}`}
      >
        <Trash2 size={18} />
      </button>

      <h3 className="text-xl font-bold text-gray-800 mb-1">{persona.title}</h3>
      <p className="text-sm text-gray-500 mb-6">{`${regionName} - ${departmentName}`}</p>
      <div className="flex items-center text-primary font-semibold group">
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

"use client";

import React from "react";
import { Persona, isGlobalPersona } from "../../types/personas"; // Adjusted import path
import { generatePersonaDocument } from "@/lib/docGenerator";
import PersonaDetailsContent from "./PersonaDetailsContent"; // Import sibling component
import { FileDown } from "lucide-react";
import { formatDepartmentName } from "@/lib/personaUtils"; // Added import

// Props definition for DetailedPersonaCard
interface DetailedPersonaCardProps {
  persona: Persona;
  showCloseButton?: boolean;
  onClose?: () => void;
  onDownload?: (e: React.MouseEvent) => void; // Keep if custom download logic is needed from parent
}

const DetailedPersonaCard = ({
  persona,
  showCloseButton = false,
  onClose = () => {},
}: // onDownload, // If onDownload prop is used, uncomment and handle. Otherwise, use internal handler.
DetailedPersonaCardProps) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up if card is clickable
    if (persona) {
      try {
        await generatePersonaDocument(persona);
      } catch (error) {
        console.error("Error generating document:", error);
        // Optionally, show an error message to the user
      }
    }
  };

  if (!persona) return null;

  // cardTitle now directly uses the normalized persona.title
  const cardTitle = persona.title;

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 my-4 relative">
      {showCloseButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close persona details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-start mb-6 pb-6 border-b border-gray-200">
        <div className="flex-grow mb-4 sm:mb-0">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">{cardTitle}</h2>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center bg-primary text-white px-5 py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 whitespace-nowrap"
        >
          <FileDown size={18} className="mr-2" />
          Export Persona
        </button>
      </div>

      <PersonaDetailsContent persona={persona} />
    </div>
  );
};

export default DetailedPersonaCard;

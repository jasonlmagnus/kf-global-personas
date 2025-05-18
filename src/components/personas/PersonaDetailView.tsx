import React from "react";
import { Persona } from "../../types/personas";
import DetailedPersonaCard from "./DetailedPersonaCard"; // Already in components/personas

interface PersonaDetailViewProps {
  selectedPersona: Persona | null;
  onClose: () => void;
}

const PersonaDetailView: React.FC<PersonaDetailViewProps> = ({
  selectedPersona,
  onClose,
}) => {
  if (!selectedPersona) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 an FadeIn">
      <style jsx global>{`
        .FadeIn {
          animation: fadeInAnimation 0.3s ease-out forwards;
        }
        @keyframes fadeInAnimation {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-8">
          <DetailedPersonaCard
            persona={selectedPersona}
            showCloseButton={true} // Let DetailedPersonaCard handle its own close if possible, or adjust styling
            onClose={onClose} // Pass onClose to DetailedPersonaCard
          />
        </div>
        {/* If DetailedPersonaCard doesn't have its own footer/close, keep this part */}
        {/* For now, assuming DetailedPersonaCard will use showCloseButton and onClose */}
        {/* If not, the explicit close button block below would be needed */}
        {/* <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PersonaDetailView;

"use client";

import React from "react";
import { PartyPopper } from "lucide-react";

interface SuccessStateProps {
  personaName: string;
  onCreateAnother: () => void;
  onViewAll: () => void;
}

const SuccessState: React.FC<SuccessStateProps> = ({
  personaName,
  onCreateAnother,
  onViewAll,
}) => {
  return (
    <div className="text-center max-w-2xl mx-auto py-16">
      <div className="flex justify-center items-center mb-6">
        <PartyPopper className="w-16 h-16 text-emerald-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-4xl font-bold text-slate-800 mb-2">Success!</h2>
      <p className="text-lg text-slate-600 mb-8">
        The persona{" "}
        <span className="font-semibold text-emerald-700">{personaName}</span>{" "}
        has been created and added to the library.
      </p>
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={onCreateAnother}
          className="px-8 py-3 bg-coral-500 text-white font-semibold rounded-lg shadow-md hover:bg-coral-600 transition-all"
        >
          Create Another Persona
        </button>
        <button
          onClick={onViewAll}
          className="px-8 py-3 bg-stone-200 text-slate-700 font-semibold rounded-lg hover:bg-stone-300 transition-all"
        >
          View All Personas
        </button>
      </div>
    </div>
  );
};

export default SuccessState;

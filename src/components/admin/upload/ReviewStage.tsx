"use client";

import React from "react";
import DetailedPersonaCard from "@/components/personas/DetailedPersonaCard";
import { Persona } from "@/types/personas";

interface ReviewStageProps {
  persona: Persona;
  onSave: () => void;
  onDiscard: () => void;
}

const ReviewStage: React.FC<ReviewStageProps> = ({
  persona,
  onSave,
  onDiscard,
}) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Review & Approve
        </h2>
        <p className="text-slate-600">
          The AI has generated the following persona based on your document.
          Please review it before saving.
        </p>
      </div>

      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-stone-200">
        <DetailedPersonaCard persona={persona} />
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onDiscard}
          className="text-sm text-slate-600 hover:text-red-600 hover:underline"
        >
          Discard & Start Over
        </button>
        <button
          onClick={onSave}
          className="px-10 py-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Save Persona
        </button>
      </div>
    </div>
  );
};

export default ReviewStage;

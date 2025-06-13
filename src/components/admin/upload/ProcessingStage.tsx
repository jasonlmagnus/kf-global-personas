"use client";

import React from "react";
import { Bot } from "lucide-react";

interface ProcessingStageProps {
  personaType: "advanced" | "simple";
  // The onComplete prop is removed as the parent now controls stage transitions.
}

const ProcessingStage: React.FC<ProcessingStageProps> = ({ personaType }) => {
  // This component is now purely presentational. It will be displayed
  // while the parent component is awaiting the API response.

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-4">
        Creation in Progress
      </h2>
      <p className="text-slate-600 mb-12">
        The AI is analyzing your document and generating the persona. Please
        wait a moment. This may take up to a minute.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 rounded-lg bg-primary/20 text-primary">
          <div className="animate-spin mr-4">
            <Bot className="w-8 h-8" />
          </div>
          <span className="font-medium text-lg">
            Mapping content to {personaType} schema...
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStage;

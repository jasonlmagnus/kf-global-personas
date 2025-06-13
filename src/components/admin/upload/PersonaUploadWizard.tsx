"use client";

import React, { useState } from "react";
import InputStage from "./InputStage";
import ProcessingStage from "./ProcessingStage";
import ReviewStage from "./ReviewStage";
import SuccessState from "./SuccessState";
import { Persona } from "@/types/personas";

type AppStage = "input" | "processing" | "review" | "success" | "error";

interface InputData {
  type: "advanced" | "simple";
  content: string;
  region: string;
  department: string;
}

const PersonaUploadWizard = () => {
  const [currentStage, setCurrentStage] = useState<AppStage>("input");
  const [inputData, setInputData] = useState<InputData | null>(null);
  const [generatedPersona, setGeneratedPersona] = useState<Persona | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: InputData) => {
    setInputData(data);
    setCurrentStage("processing");
    setError(null);

    try {
      const response = await fetch("/api/personas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate persona.");
      }

      const persona = await response.json();
      setGeneratedPersona(persona);
      setCurrentStage("review");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setCurrentStage("error");
    }
  };

  const handleSave = async () => {
    if (!generatedPersona) return;
    try {
      const response = await fetch("/api/personas/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedPersona),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save persona.");
      }

      setCurrentStage("success");
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setCurrentStage("error");
    }
  };

  const handleProcessingComplete = () => {
    if (generatedPersona) {
      setCurrentStage("review");
    } else {
      setError("An unknown error occurred during processing.");
      setCurrentStage("error");
    }
  };

  const handleDiscard = () => {
    setCurrentStage("input");
    setInputData(null);
    setGeneratedPersona(null);
    setError(null);
  };

  const handleTryAgain = () => {
    handleDiscard();
  };

  const handleCreateAnother = () => {
    handleDiscard();
  };

  const handleViewAll = () => {
    window.location.href = "/personas";
  };

  const ErrorDisplay = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div className="text-center max-w-2xl mx-auto py-16">
      <h2 className="text-3xl font-bold text-red-600 mb-4">
        An Error Occurred
      </h2>
      <p className="text-slate-600 mb-8 bg-red-50 p-4 rounded-lg border border-red-200">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all"
      >
        Try Again
      </button>
    </div>
  );

  const ProgressIndicator = () => (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div
              className={`flex items-center space-x-3 transition-all duration-300 ${
                ["input"].includes(currentStage)
                  ? "text-primary"
                  : "text-emerald-600"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  ["input"].includes(currentStage)
                    ? "bg-primary/20 text-primary"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                1
              </div>
              <div>
                <div className="font-medium text-slate-900">Briefing</div>
                <div className="text-xs text-slate-500">
                  Define requirements
                </div>
              </div>
            </div>
            <div
              className={`h-px w-16 transition-all duration-300 ${
                ["processing", "review"].includes(currentStage)
                  ? "bg-primary/50"
                  : "bg-stone-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-3 transition-all duration-300 ${
                currentStage === "processing"
                  ? "text-primary"
                  : currentStage === "review"
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStage === "processing"
                    ? "bg-primary/20 text-primary"
                    : currentStage === "review"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-slate-500"
                }`}
              >
                2
              </div>
              <div>
                <div className="font-medium text-slate-900">Creation</div>
                <div className="text-xs text-slate-500">AI processing</div>
              </div>
            </div>
            <div
              className={`h-px w-16 transition-all duration-300 ${
                currentStage === "review" ? "bg-primary/50" : "bg-stone-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-3 transition-all duration-300 ${
                currentStage === "review" ? "text-primary" : "text-slate-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStage === "review"
                    ? "bg-primary/20 text-primary"
                    : "bg-stone-100 text-slate-500"
                }`}
              >
                3
              </div>
              <div>
                <div className="font-medium text-slate-900">Review</div>
                <div className="text-xs text-slate-500">Final approval</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {currentStage !== "success" && currentStage !== "error" && (
        <ProgressIndicator />
      )}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-8">
          {currentStage === "input" && (
            <InputStage onGenerate={handleGenerate} />
          )}
          {currentStage === "processing" && inputData && (
            <ProcessingStage personaType={inputData.type} />
          )}
          {currentStage === "review" && generatedPersona && (
            <ReviewStage
              persona={generatedPersona}
              onSave={handleSave}
              onDiscard={handleDiscard}
            />
          )}
          {currentStage === "success" && generatedPersona && (
            <SuccessState
              personaName={generatedPersona.title}
              onCreateAnother={handleCreateAnother}
              onViewAll={handleViewAll}
            />
          )}
          {currentStage === "error" && error && (
            <ErrorDisplay message={error} onRetry={handleTryAgain} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaUploadWizard;

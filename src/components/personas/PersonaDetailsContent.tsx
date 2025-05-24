"use client";

import React from "react";
import {
  Persona,
  isGlobalPersona,
  isCountryPersona,
} from "../../types/personas"; // Adjusted import path
import GlobalPersonaTemplate from "./GlobalPersonaTemplate"; // Added import
import CountryPersonaTemplate from "./CountryPersonaTemplate"; // Added import

// Component to display detailed persona content
const PersonaDetailsContent = ({ persona }: { persona: Persona }) => {
  if (isGlobalPersona(persona)) {
    return <GlobalPersonaTemplate persona={persona} />;
  } else if (isCountryPersona(persona)) {
    // Ensure you pass the correct persona type if CountryPersonaTemplate expects CountryPersona specifically
    return <CountryPersonaTemplate persona={persona} />;
  }

  // Fallback or loading state if needed, though templates handle their own null persona state
  return <div>Error: Unknown persona type or persona not loaded.</div>;
};

export default PersonaDetailsContent;

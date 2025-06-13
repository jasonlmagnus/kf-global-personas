"use client";

import React, { useEffect } from "react";
import { BrandConfig } from "@/contexts/ThemeContext";

const supportedFonts = [
  "Inter",
  "Roboto",
  "Lato",
  "Montserrat",
  "Oswald",
  "Open Sans",
  "Nunito",
];

interface FontSettingsProps {
  settings: BrandConfig;
  onSettingsChange: (updatedSettings: Partial<BrandConfig>) => void;
}

// Function to dynamically load a font from Google Fonts
const loadFont = (fontFamily: string) => {
  const fontQuery = fontFamily.replace(/ /g, "+");
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@400;700&display=swap`;
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);

  if (!existingLink) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);
  }
};

const FontSettings: React.FC<FontSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const { fontFamily } = settings.typography;
  const primaryFont = fontFamily.split(",")[0].trim();

  // Load the initial font when the component mounts
  useEffect(() => {
    loadFont(primaryFont);
  }, [primaryFont]);

  const handleFontSelect = (newFontFamily: string) => {
    loadFont(newFontFamily);
    const fontName = newFontFamily.split(",")[0].trim();
    const newTypography = {
      ...settings.typography,
      fontFamily: `${fontName}, sans-serif`,
      googleFontUrl: `https://fonts.googleapis.com/css2?family=${fontName.replace(
        / /g,
        "+"
      )}:wght@400;700&display=swap`,
    };
    onSettingsChange({ typography: newTypography });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Typography</h3>
      <div>
        <label
          htmlFor="font-select"
          className="block text-sm font-medium text-slate-600 mb-2"
        >
          Application Font
        </label>
        <select
          id="font-select"
          value={primaryFont}
          onChange={(e) => handleFontSelect(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md"
        >
          {supportedFonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 p-4 bg-slate-50 rounded-md">
        <p className="text-lg" style={{ fontFamily: fontFamily }}>
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  );
};

export default FontSettings;

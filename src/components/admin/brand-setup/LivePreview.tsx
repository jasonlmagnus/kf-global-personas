"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { BrandConfig } from "@/contexts/ThemeContext";

interface LivePreviewProps {
  settings: BrandConfig | null;
  // Kept for the temporary logo object URL
  logoPath?: string | null;
}

const LivePreview: React.FC<LivePreviewProps> = ({ settings, logoPath }) => {
  if (!settings) {
    return (
      <div className="bg-white p-6 rounded-lg shadow sticky top-8 animate-pulse">
        <div className="h-8 w-full bg-gray-200 rounded mb-4"></div>
        <div className="h-40 w-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  const { colors, typography } = settings;
  const displayLogo = logoPath || settings.logoUrl;

  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-8">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Live Preview</h3>

      {/* Header Preview */}
      <div
        className="p-4 rounded-t-lg flex items-center justify-between"
        style={{ backgroundColor: colors.primary, color: colors.headerText }}
      >
        {displayLogo ? (
          <img src={displayLogo} alt="Logo" className="h-8" />
        ) : (
          <div className="h-8 w-24 bg-gray-600 rounded" />
        )}
        <div className="flex items-center space-x-4">
          <div className="h-4 w-16 bg-gray-600 rounded" />
          <div className="h-4 w-16 bg-gray-600 rounded" />
        </div>
      </div>

      {/* Main Content Preview */}
      <div className="p-6 border-x border-b rounded-b-lg">
        {/* Sample Card */}
        <div
          className="border-2 rounded-lg p-6 shadow-md"
          style={{ borderColor: colors.primary }}
        >
          <h3
            className="text-xl font-bold mb-1"
            style={{
              color: colors.text,
              fontFamily: typography.fontFamily,
            }}
          >
            Sample Persona Title
          </h3>
          <p
            className="text-sm mb-6"
            style={{
              color: colors.text,
              fontFamily: typography.fontFamily,
              opacity: 0.7,
            }}
          >
            REGION - DEPARTMENT
          </p>
          <div
            className="flex items-center font-semibold group"
            style={{
              color: colors.primary,
              fontFamily: typography.fontFamily,
            }}
          >
            View Details
            <ArrowRight size={16} className="ml-2" />
          </div>
        </div>

        {/* Sample Button */}
        <div className="mt-6">
          <button
            className="w-full text-white font-semibold py-2 px-4 rounded-lg"
            style={{ backgroundColor: colors.accent }}
          >
            Primary Action Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;

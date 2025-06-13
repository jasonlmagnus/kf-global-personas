"use client";

import React, { useState } from "react";
import { SketchPicker, ColorResult } from "react-color";
import { BrandConfig } from "@/contexts/ThemeContext";

interface ColorSettingsProps {
  settings: BrandConfig;
  onSettingsChange: (updatedSettings: Partial<BrandConfig>) => void;
}

const ColorSettings: React.FC<ColorSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState<
    "primary" | "text" | null
  >(null);

  const { primary: primaryColor, text: textColor } = settings.colors;

  const handleColorChange = (color: ColorResult) => {
    if (displayColorPicker) {
      const newColors = { ...settings.colors, [displayColorPicker]: color.hex };
      onSettingsChange({ colors: newColors });
    }
  };

  const handleClose = () => {
    setDisplayColorPicker(null);
  };

  const popover: React.CSSProperties = {
    position: "absolute",
    zIndex: 2,
  };
  const cover: React.CSSProperties = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Color Palette</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Primary / Accent Color
          </label>
          <div className="relative">
            <div
              className="w-full h-10 rounded-md border border-slate-300 flex items-center justify-between px-3 cursor-pointer"
              onClick={() => setDisplayColorPicker("primary")}
            >
              <span>{primaryColor}</span>
              <div
                className="w-6 h-6 rounded-sm border"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
            {displayColorPicker === "primary" && (
              <div style={popover}>
                <div style={cover} onClick={handleClose} />
                <SketchPicker
                  color={primaryColor}
                  onChange={handleColorChange}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Main Text Color
          </label>
          <div className="relative">
            <div
              className="w-full h-10 rounded-md border border-slate-300 flex items-center justify-between px-3 cursor-pointer"
              onClick={() => setDisplayColorPicker("text")}
            >
              <span>{textColor}</span>
              <div
                className="w-6 h-6 rounded-sm border"
                style={{ backgroundColor: textColor }}
              />
            </div>
            {displayColorPicker === "text" && (
              <div style={popover}>
                <div style={cover} onClick={handleClose} />
                <SketchPicker color={textColor} onChange={handleColorChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorSettings;

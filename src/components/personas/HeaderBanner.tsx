"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

const HeaderBanner: React.FC = () => {
  const { theme } = useTheme();

  return (
    <header className="bg-[#003C2D] text-white p-6 shadow-md">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">
          {theme?.brandName || "Korn Ferry Personas"}
        </h1>
      </div>
    </header>
  );
};

export default HeaderBanner;

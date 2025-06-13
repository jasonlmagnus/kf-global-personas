"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

const Footer: React.FC = () => {
  const { theme } = useTheme();

  if (!theme) {
    return null; // Don't render if no theme is loaded
  }

  const { brandName, footer } = theme;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-brand-header-text p-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {currentYear} {footer.copyrightName || brandName}. All rights
              reserved.
            </p>
          </div>
          {footer.links && footer.links.length > 0 && (
            <div className="flex space-x-6 text-sm">
              {footer.links.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="hover:text-gray-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

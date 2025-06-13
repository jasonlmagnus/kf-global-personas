"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { useChatbot } from "@/contexts/ChatbotContext";
import { MessageCircle } from "lucide-react";

const GlobalNav: React.FC = () => {
  const { theme, isLoading } = useTheme();
  const { openPanel } = useChatbot();

  if (isLoading || !theme) {
    // Render a placeholder or loader while the theme is loading
    return (
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center space-x-6">
            <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  const { brandName, logoUrl, navigation } = theme;

  return (
    <header className="bg-brand-primary text-brand-header-text p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src={logoUrl}
            alt={`${brandName} Logo`}
            width={140}
            height={40}
            priority
          />
        </Link>
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex items-center space-x-6">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="hover:text-gray-300 transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/personas"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Personas
          </Link>
          <Link
            href="/admin/upload"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Upload
          </Link>
          <button
            onClick={openPanel}
            className="p-2 rounded-md hover:bg-black/10 transition-colors"
            title="Open AI Assistant"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default GlobalNav;

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useChatbot } from "@/contexts/ChatbotContext";

export default function GlobalNav() {
  const pathname = usePathname();
  const { openPanel } = useChatbot();

  const navItemBaseClasses = "px-4 py-2 rounded-md text-sm font-semibold";
  // Active item: plain text, not acting like a link, distinct background
  const activeItemClasses = `${navItemBaseClasses} bg-black/20 text-white cursor-default`;
  // Inactive item: styled link with hover effects
  const inactiveItemClasses = `${navItemBaseClasses} text-gray-200 hover:text-white hover:bg-black/10 transition-colors duration-150`;

  return (
    // Using bg-[#0A523E] for the main nav bar background
    <nav className="bg-[#0A523E] text-white w-full p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/kf-logo-white.svg"
            alt="Korn Ferry Logo"
            width={160}
            height={45}
            priority
          />
        </Link>
        <span className="text-xl font-bold text-white ml-4">
          Global Personas
        </span>

        <div className="flex items-center space-x-6 ml-auto">
          {pathname === "/personas" ? (
            <span className={activeItemClasses}>Personas</span>
          ) : (
            <Link href="/personas" className={inactiveItemClasses}>
              Personas
            </Link>
          )}

          {pathname === "/data" ? (
            <span className={activeItemClasses}>Data</span>
          ) : (
            <Link href="/data" className={inactiveItemClasses}>
              Data
            </Link>
          )}

          {pathname === "/content" ? (
            <span className={activeItemClasses}>Content</span>
          ) : (
            <Link href="/content" className={inactiveItemClasses}>
              Content
            </Link>
          )}

          {/* AI Chat Icon */}
          <button
            onClick={openPanel}
            className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-black/10 transition-colors duration-150"
            title="Open AI Personas Assistant"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

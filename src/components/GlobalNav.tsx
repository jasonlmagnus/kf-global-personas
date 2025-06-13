"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { useChatbot } from "@/contexts/ChatbotContext";
import { MessageCircle, LogIn, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const GlobalNav: React.FC = () => {
  const { theme, isLoading } = useTheme();
  const { openPanel } = useChatbot();
  const { data: session, status } = useSession();

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
  const user = session?.user;

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(
    (item) =>
      item.path !== "/admin/brand-setup" ||
      (user && user.role === "SUPER_ADMIN")
  );

  return (
    <header className="bg-primary text-white p-4 shadow-md">
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
              {filteredNavigation.map((item) => (
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
          <button
            onClick={openPanel}
            className="p-2 rounded-md hover:bg-black/10 transition-colors"
            title="Open AI Assistant"
          >
            <MessageCircle size={20} />
          </button>

          {status === "loading" ? (
            <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/10 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-black/10 transition-colors"
              title="Login"
            >
              <LogIn size={20} />
              <span className="text-sm font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalNav;

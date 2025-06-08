"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalNav from "@/components/GlobalNav";
import PasswordProtection from "@/components/PasswordProtection";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { ChatbotPanel } from "@/components/chatbot/ChatbotPanel";

const inter = Inter({ subsets: ["latin"] });

// Note: Metadata export is not supported in client components
// You may want to move this to a separate server component if needed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>KF Personas | Korn Ferry</title>
        <meta
          name="description"
          content="A centralized library of global and regional personas"
        />
        {/* Search Engine Protection Meta Tags */}
        <meta
          name="robots"
          content="noindex, nofollow, noarchive, nosnippet, noimageindex"
        />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="bingbot" content="noindex, nofollow" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <PasswordProtection>
          <ChatbotProvider>
            <GlobalNav />
            <main className="flex-grow container mx-auto p-4">{children}</main>
            <ChatbotPanel />
          </ChatbotProvider>
        </PasswordProtection>
      </body>
    </html>
  );
}

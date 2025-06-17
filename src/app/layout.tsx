"use client";

import "./globals.css";
import GlobalNav from "@/components/GlobalNav";
import { ChatbotProvider } from "@/contexts/ChatbotContext";
import { ChatbotPanel } from "@/components/chatbot/ChatbotPanel";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

// Note: Metadata export is not supported in client components
// You may want to move this to a separate server component if needed

// This new component wraps the part of the layout that depends on the session
export function ThemedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // 1. For Brand Users, use their brand.
  // 2. For Super Admins, default to 'korn-ferry'.
  // 3. Before session loads or for logged-out users, default to 'magnus'.
  const brand = session?.user?.brand || "magnus";

  return (
    <ThemeProvider brand={brand}>
      {status === "loading" ? (
        <div className="flex items-center justify-center min-h-screen w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500"></div>
        </div>
      ) : (
        <ChatbotProvider>
          <div className="flex flex-col min-h-screen">
            <GlobalNav />
            <main className="flex-grow container mx-auto p-4">{children}</main>
            <Footer />
          </div>
          <ChatbotPanel />
        </ChatbotProvider>
      )}
    </ThemeProvider>
  );
}

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
      <body className={`${inter.className} bg-brand-background`}>
        <AuthProvider>
          <ThemedLayout>{children}</ThemedLayout>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

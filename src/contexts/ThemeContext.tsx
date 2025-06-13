"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of the theme configuration
interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textLight: string;
  background: string;
  headerText: string;
}

interface BrandTypography {
  fontFamily: string;
  googleFontUrl?: string;
}

interface BrandNavItem {
  name: string;
  path: string;
}

interface BrandFooterLink {
  name: string;
  path: string;
}

interface BrandFooter {
  copyrightName?: string;
  links?: BrandFooterLink[];
}

interface BrandChatbot {
  headerColor: string;
  assistantName: string;
  assistantSubtitle: string;
  welcomeMessage: string;
  userBubbleColor: string;
  assistantBubbleColor: string;
}

export interface BrandConfig {
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  colors: BrandColors;
  typography: BrandTypography;
  navigation: BrandNavItem[];
  footer: BrandFooter;
  chatbot: BrandChatbot;
}

// Define the context shape
interface ThemeContextType {
  theme: BrandConfig | null;
  isLoading: boolean;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the provider component
interface ThemeProviderProps {
  children: ReactNode;
  brand?: string; // Allow forcing a brand, otherwise determined automatically
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  brand, // Remove the hardcoded default
}) => {
  const [theme, setTheme] = useState<BrandConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no brand is provided, do nothing. Wait for a brand.
    if (!brand) {
      setIsLoading(false); // Not loading, just waiting for a brand
      setTheme(null); // Ensure no old theme persists
      return;
    }

    const fetchTheme = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/brands/${brand}/brand.config.json?v=${new Date().getTime()}`
        );
        if (!response.ok) {
          throw new Error(`Failed to load brand config for: ${brand}`);
        }
        const config: BrandConfig = await response.json();
        setTheme(config);

        // Apply theme to the document
        applyThemeToDocument(config);
      } catch (error) {
        console.error("Theme loading error:", error);
        // Fallback to default theme or show an error state
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, [brand]); // Restoring `brand` to the dependency array

  const applyThemeToDocument = (config: BrandConfig) => {
    const root = document.documentElement;

    // Apply colors
    root.style.setProperty("--brand-primary", config.colors.primary);
    root.style.setProperty("--brand-secondary", config.colors.secondary);
    root.style.setProperty("--brand-accent", config.colors.accent);
    root.style.setProperty("--brand-text", config.colors.text);
    root.style.setProperty("--brand-text-light", config.colors.textLight);
    root.style.setProperty("--brand-background", config.colors.background);
    root.style.setProperty("--brand-header-text", config.colors.headerText);

    // Apply fonts
    if (config.typography.googleFontUrl) {
      const existingLink = document.querySelector(
        `link[href="${config.typography.googleFontUrl}"]`
      );
      if (!existingLink) {
        const link = document.createElement("link");
        link.href = config.typography.googleFontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    }
    root.style.setProperty("font-family", config.typography.fontFamily);

    // Apply favicon
    const favicon = document.querySelector(
      "link[rel~='icon']"
    ) as HTMLLinkElement;
    if (favicon) {
      favicon.href = config.faviconUrl;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isLoading }}>
      {/* 
        The loading spinner is removed from here. 
        Individual pages should handle their own loading state based on the context's `isLoading` flag.
        This prevents the entire application from being blocked.
      */}
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

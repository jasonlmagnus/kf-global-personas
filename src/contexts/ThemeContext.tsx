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

interface BrandConfig {
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
  brand = "magnus",
}) => {
  const [theme, setTheme] = useState<BrandConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      setIsLoading(true);
      try {
        // For now, we fetch from a local path. This could be an API endpoint later.
        const response = await fetch(`/brands/${brand}/brand.config.json`);
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
  }, [brand]);

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
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          {/* Simple loading spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
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

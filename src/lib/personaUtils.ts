import { Region, Department, Persona } from "../types/personas";

// Helper function to format department names
export const formatDepartmentName = (department: Department | undefined | null): string => {
  if (!department) return '';
  const words = department.split('_');
  return words
    .map((word) => {
      if (word.toLowerCase() === 'ceo') return 'CEO';
      if (word.toLowerCase() === 'chro') return 'CHRO';
      // For multi-word departments like 'leadership_dev', capitalize each word.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

// Add a helper function to determine if region code should be hidden
export const shouldHideRegionCode = (title: string, region: string): boolean => {
  // Check if the title already contains the region name
  const regionNames: Record<string, string[]> = {
    aus: ["Australia", "Australian", "AUS"],
    uk: ["UK", "British", "England", "United Kingdom"],
    uae: ["UAE", "Emirates", "Dubai", "Abu Dhabi"],
  };

  const regionVariants = regionNames[region.toLowerCase()] || [];
  return regionVariants.some((variant) =>
    title.toLowerCase().includes(variant.toLowerCase())
  );
};

// Function to get the right background image based on role/department
export const getRoleImage = (department: Department): string => {
  // Map department to executive roles
  const roleMapping: { [key: string]: string } = {
    ceo: "Chief Executive Officer",
    chro: "Chief HR Officer",
    sales: "Chief Marketing Officer", // using marketing for sales
    talent: "Chief Operations Officer", // using operations for talent
    rewards: "Chief Financial Officer",
    leadership_dev: "Chief Technology Officer",
  };

  // Get the executive role title
  const roleTitle = roleMapping[department] || "Chief Executive Officer";

  // Map to the exact URLs provided
  switch (roleTitle) {
    case "Chief Executive Officer":
      return "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80')";
    case "Chief Technology Officer":
      return "url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80')";
    case "Chief Financial Officer":
      return "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80')";
    case "Chief HR Officer":
      return "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')";
    case "Chief Marketing Officer":
      return "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80')";
    case "Chief Operations Officer":
      return "url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80')";
    default:
      return "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80')";
  }
};

// Function to get the right background image for each region
export const getRegionBackground = (
  region: Region,
  viewType: "single" | "role" | "region", // Added viewType parameter
  department?: Department
): string => {
  // ROLE VIEW: For cards in the role grid, use region/country images
  // to show the same role across different regions
  if (viewType === "role" && department) {
    // Country-specific images for Role view
    switch (region) {
      case "uk":
        return `url('https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80')`;
      case "uae":
        return `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80')`;
      case "aus":
        return `url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80')`;
      default:
        return `url('https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80')`;
    }
  }

  // REGION VIEW: For cards in the region grid, use role/department images
  // to show different roles within the same region
  if (viewType === "region" && department) {
    return getRoleImage(department); // Calls the local getRoleImage
  }

  // Fallback to region-based backgrounds if no department is specified
  try {
    switch (region) {
      case "uk":
        return `url('https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80'), linear-gradient(to bottom, #1a3a5f, #0a192f)`;
      case "uae":
        return `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80'), linear-gradient(to bottom, #a56729, #704214)`;
      case "aus":
        return `url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80'), linear-gradient(to bottom, #194b53, #0d2c32)`;
      case "global":
      default:
        return "linear-gradient(to bottom, #0A523E, #042b20)";
    }
  } catch (error) {
    // Fallback to gradients if images fail to load
    switch (region) {
      case "uk":
        return "linear-gradient(to bottom, #1a3a5f, #0a192f)";
      case "uae":
        return "linear-gradient(to bottom, #a56729, #704214)";
      case "aus":
        return "linear-gradient(to bottom, #194b53, #0d2c32)";
      case "global":
      default:
        return "linear-gradient(to bottom, #0A523E, #042b20)";
    }
  }
};

// Helper: generate consistent title in Role view cards
export const getRoleCardTitle = (p: Persona, viewType: "single" | "role" | "region"): string => {
  let title = p.title;

  if (viewType === "role") {
    if (p.department === 'ceo') {
      title = title.replace(/Chief Executive Officer/g, 'CEO');
    }
    if (p.department === 'chro') {
      title = title.replace(/Chief Human Resources Officer/g, 'CHRO');
    }
  }
  
  return title;
}; 
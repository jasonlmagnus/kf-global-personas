import { notFound } from "next/navigation";
import { Persona } from "@/types/personas"; // Assuming Persona type is defined here
import DetailedPersonaCard from "@/components/personas/DetailedPersonaCard"; // Import DetailedPersonaCard

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

// Helper function to get the base URL for API calls
function getBaseUrl(): string {
  // During build time (static generation), use localhost
  if (typeof window === "undefined") {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000";
  }
  // Client-side, use relative URLs
  return "";
}

// Helper to construct full URLs
function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}

// Helper function to fetch all personas for static generation
async function getAllPersonaIds() {
  try {
    const res = await fetch(getFullUrl("/api/personas"), {
      cache: "no-store",
    }); // Fetch all personas
    if (!res.ok) {
      console.error(
        "Failed to fetch personas for static generation:",
        res.status,
        await res.text()
      );
      return [];
    }
    const personasData: Persona[] = await res.json();
    // Filter out global personas from static generation
    return personasData
      .filter((persona) => persona.isGlobal === false) // Or !persona.id.startsWith('global-') if isGlobal is not reliable yet
      .map((persona) => ({
        personaId: persona.id,
      }));
  } catch (error) {
    console.error("Error in getAllPersonaIds:", error);
    // During build time, if we can't fetch personas, return empty array
    // This prevents build failures while still allowing dynamic rendering
    return [];
  }
}

// export async function generateStaticParams() {
//   try {
//     return await getAllPersonaIds();
//   } catch (error) {
//     console.error("Error in generateStaticParams:", error);
//     // Return empty array to prevent build failure
//     return [];
//   }
// }

// Helper function to fetch a single persona by its composite ID
async function getPersonaById(id: string): Promise<Persona | null> {
  const parts = id.split("-");
  if (parts.length < 2) {
    // Simple validation, global might be just 'global-ceo'
    console.error("Invalid personaId format:", id);
    return null;
  }

  // Handle cases like 'global-ceo-board' or 'global-leadership_dev'
  const region = parts[0];
  const department = parts.slice(1).join("-"); // department can contain hyphens (e.g., leadership_dev)

  try {
    const res = await fetch(
      getFullUrl(`/api/personas?region=${region}&department=${department}`),
      { cache: "no-store" }
    );
    if (!res.ok) {
      // Log more detailed error from API if possible
      console.error(
        `Failed to fetch persona ${id}:`,
        res.status,
        await res.text()
      );
      return null;
    }
    const personaData: Persona = await res.json();
    // Ensure the fetched persona has an ID, as our API should provide it
    if (!personaData || !personaData.id) {
      console.warn(
        `Persona data for ${id} is missing or lacks an id from API.`
      );
      return null;
    }
    return personaData;
  } catch (error) {
    console.error(`Error fetching persona ${id}:`, error);
    return null;
  }
}

interface PageParams {
  personaId: string;
}

export default async function PersonaPage({ params }: { params: PageParams }) {
  console.log(
    `DEBUG: PersonaPage - Fetching persona for ID: ${params.personaId}`
  ); // Log input to getPersonaById
  const persona = await getPersonaById(params.personaId);

  console.log(
    "DEBUG: PersonaPage - Persona object received:",
    JSON.stringify(persona, null, 2)
  ); // Log the fetched persona object

  if (!persona) {
    console.log(
      `DEBUG: PersonaPage - Persona not found for ID: ${params.personaId}, calling notFound()`
    );
    notFound();
  }

  // return <PersonaCard persona={persona} />; // OLD LINE
  // Render DetailedPersonaCard directly for the page content
  // onClose is not strictly necessary if this is a standalone page view unless DetailedPersonaCard requires it.
  // showCloseButton can also be true or false depending on whether you want a close button on this page view.
  return <DetailedPersonaCard persona={persona} showCloseButton={false} />;
}

import PersonaCard from "@/components/PersonaCard";
import { notFound } from "next/navigation";
import { Persona } from "@/types/personas"; // Assuming Persona type is defined here

// Helper function to fetch all personas for static generation
async function getAllPersonaIds() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/personas`, {
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
    return [];
  }
}

export async function generateStaticParams() {
  return getAllPersonaIds();
}

// Helper function to fetch a single persona by its composite ID
async function getPersonaById(id: string): Promise<Persona | null> {
  // Prevent fetching detail for global personas for now
  if (id.startsWith("global-")) {
    console.log(
      `Detail page for global persona ${id} is not currently supported.`
    );
    return null;
  }

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
      `${process.env.NEXT_PUBLIC_APP_URL}/api/personas?region=${region}&department=${department}`,
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
  const persona = await getPersonaById(params.personaId);

  if (!persona) {
    notFound();
  }

  return <PersonaCard persona={persona} />;
}

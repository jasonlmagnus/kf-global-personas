import { personas } from "@/data/personas";
import PersonaCard from "@/components/PersonaCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return personas.map((persona) => ({
    personaId: persona.id,
  }));
}

interface PageParams {
  personaId: string;
}

export default function PersonaPage({ params }: { params: PageParams }) {
  const persona = personas.find((p) => p.id === params.personaId);

  if (!persona) {
    notFound();
  }

  return <PersonaCard persona={persona} />;
}

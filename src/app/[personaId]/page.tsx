import { personas } from "@/data/personas";
import PersonaCard from "@/components/PersonaCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return personas.map((persona) => ({
    personaId: persona.id,
  }));
}

type Props = {
  params: { personaId: string };
};

export default function PersonaPage({ params }: Props) {
  const persona = personas.find((p) => p.id === params.personaId);

  if (!persona) {
    notFound();
  }

  return <PersonaCard persona={persona} />;
}

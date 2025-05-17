"use client";

import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Persona } from '@/types/Persona';

interface SidebarProps {
  personas: Persona[];
}

export default function Sidebar({ personas }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-semibold text-white">Personas</h1>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {personas.map((persona) => (
            <li key={persona.id}>
              <Link
                href={`/${persona.id}`}
                className={cn(
                  "block w-full text-left px-4 py-3 rounded-lg transition-colors",
                  "hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  pathname === `/${persona.id}`
                    ? "bg-blue-600 text-white"
                    : "text-white"
                )}
              >
                <div className="font-medium">{persona.title}</div>
                <div className={cn(
                  "text-sm",
                  pathname === `/${persona.id}`
                    ? "text-blue-200"
                    : "text-gray-400"
                )}>
                  {persona.department}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

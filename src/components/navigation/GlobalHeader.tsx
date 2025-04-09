"use client";

import Link from "next/link";
import { Search, ChevronDown, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalHeader() {
  const [region, setRegion] = useState<string>("global");
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  // Generate breadcrumbs based on pathname
  const generateBreadcrumbs = () => {
    if (pathname === "/") return [{ name: "Home", path: "/" }];

    const parts = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Home", path: "/" }];

    parts.forEach((part, i) => {
      const path = `/${parts.slice(0, i + 1).join("/")}`;
      breadcrumbs.push({
        name: part.charAt(0).toUpperCase() + part.slice(1),
        path,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold">
            KF
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center gap-1">
              {region.charAt(0).toUpperCase() + region.slice(1)}
              <ChevronDown size={16} />
            </Button>

            <Button variant="outline" className="flex items-center gap-1">
              {role || "Role"}
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search personas..." className="pl-8" />
          </div>

          <Button variant="outline" className="flex items-center gap-1">
            <BarChart2 size={16} />
            Compare
          </Button>
        </div>
      </div>

      <div className="flex px-4 py-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && <span className="mx-2">{">"}</span>}
            <Link href={crumb.path} className="hover:text-foreground">
              {crumb.name}
            </Link>
          </div>
        ))}
      </div>
    </header>
  );
}

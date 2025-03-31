import React from "react";

type SectionCardProps = {
  icon: React.ElementType;
  title: string;
  color?: string;
  children: React.ReactNode;
};

export function SectionCard({
  icon: Icon,
  title,
  children,
  color = "text-gray-800",
}: SectionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className={`flex items-center mb-4 ${color}`}>
        <Icon className="mr-2 h-5 w-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

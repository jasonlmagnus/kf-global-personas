"use client";
import React from "react";
import { personas } from "../data/personas";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Personas</h1>
      <div className="grid gap-8">
        {personas.map((persona) => (
          <div key={persona.id} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">{persona.title}</h2>
            <p className="text-gray-600 mb-4">{persona.department}</p>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Goal Statement:</h3>
              <p className="text-gray-700">{persona.goalStatement}</p>
            </div>
            {persona.quote && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Quote:</h3>
                <p className="text-gray-700 italic">{persona.quote}</p>
              </div>
            )}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Needs:</h3>
              <ul className="list-disc pl-5">
                {persona.needs.map((need, index) => (
                  <li key={index} className="text-gray-700">
                    {need}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Motivations:</h3>
              <ul className="list-disc pl-5">
                {persona.motivations.map((motivation, index) => (
                  <li key={index} className="text-gray-700">
                    {motivation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

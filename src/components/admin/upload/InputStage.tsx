"use client";

import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

// This component's responsibility is just to gather the core content,
// not to know about the brand. The parent wizard handles the brand.
interface InputData {
  type: "advanced" | "simple";
  content: string;
  region: string;
  department: string;
}

interface InputStageProps {
  onGenerate: (data: InputData) => void;
}

const InputStage: React.FC<InputStageProps> = ({ onGenerate }) => {
  const [type, setType] = useState<"advanced" | "simple">("advanced");
  const [content, setContent] = useState("");
  const [region, setRegion] = useState("");
  const [department, setDepartment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !region || !department) {
      alert("Please fill out all fields.");
      return;
    }
    onGenerate({ type, content, region, department });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-200">
        {/* Step 1: Persona Type */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-slate-800 mb-3">
            Persona Template
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setType("advanced")}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                type === "advanced"
                  ? "border-primary bg-primary/10"
                  : "border-stone-200 hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-slate-900">
                Advanced (Global)
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                For strategic, global personas with deep, structured data.
              </p>
            </div>
            <div
              onClick={() => setType("simple")}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                type === "simple"
                  ? "border-primary bg-primary/10"
                  : "border-stone-200 hover:border-primary/50"
              }`}
            >
              <h3 className="font-semibold text-slate-900">Simple (Country)</h3>
              <p className="text-sm text-slate-600 mt-1">
                For tactical, regional personas highlighting local differences.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Content */}
        <div className="mb-8">
          <label
            htmlFor="content"
            className="block text-lg font-medium text-slate-800 mb-3"
          >
            Source Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste raw text from your source document here..."
            className="w-full h-48 p-4 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <div className="mt-4 text-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/20 hover:bg-primary/30"
            >
              <UploadCloud className="mr-3" size={20} />
              Or upload a document (.txt, .md)
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept=".txt,.md"
            />
          </div>
        </div>

        {/* Step 3: Metadata */}
        <div>
          <label className="block text-lg font-medium text-slate-800 mb-3">
            Metadata
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value.toLowerCase())}
              placeholder="Region (e.g., global, uk, aus)"
              className="w-full p-4 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value.toLowerCase())}
              placeholder="Department (e.g., ceo, sales)"
              className="w-full p-4 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="px-10 py-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Generate Persona
        </button>
      </div>
    </form>
  );
};

export default InputStage;

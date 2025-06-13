import React, { useState } from 'react';
import { Upload, FileText, Globe, MapPin, Target, Users } from 'lucide-react';

interface InputStageProps {
  onGenerate: (data: {
    type: 'advanced' | 'simple';
    content: string;
    region: string;
    department: string;
  }) => void;
}

export default function InputStage({ onGenerate }: InputStageProps) {
  const [personaType, setPersonaType] = useState<'advanced' | 'simple'>('advanced');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState('');
  const [department, setDepartment] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = () => {
    if (content.trim() && region.trim() && department.trim()) {
      onGenerate({
        type: personaType,
        content: content.trim(),
        region: region.trim(),
        department: department.trim(),
      });
    }
  };

  const isFormValid = content.trim() && region.trim() && department.trim();

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
          Transform Content Into Intelligence
        </h1>
        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
          Our AI-powered engine converts your raw research and insights into structured, 
          actionable personas that drive <span className="text-coral-600 font-medium">better growth outcomes</span>.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-8 py-8">
          <div className="flex items-center space-x-3 text-white">
            <Target className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-light">Persona Creation Brief</h2>
              <p className="text-coral-100 font-light">Define your requirements to begin</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Persona Type Selection */}
          <div>
            <h3 className="text-xl font-medium text-slate-900 mb-6 flex items-center">
              <Users className="h-6 w-6 mr-3 text-coral-600" />
              Define the Persona's Scope
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setPersonaType('advanced')}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left group hover:shadow-lg ${
                  personaType === 'advanced'
                    ? 'border-coral-500 bg-coral-50 shadow-lg ring-4 ring-coral-100'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center mb-4">
                  <Globe className={`h-7 w-7 mr-4 transition-colors duration-300 ${
                    personaType === 'advanced' ? 'text-coral-600' : 'text-slate-500 group-hover:text-slate-600'
                  }`} />
                  <h4 className="text-lg font-medium text-slate-900">Advanced (Global) Persona</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  For foundational, strategic personas that serve as the global standard 
                  and drive organizational alignment.
                </p>
              </button>

              <button
                onClick={() => setPersonaType('simple')}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left group hover:shadow-lg ${
                  personaType === 'simple'
                    ? 'border-coral-500 bg-coral-50 shadow-lg ring-4 ring-coral-100'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center mb-4">
                  <MapPin className={`h-7 w-7 mr-4 transition-colors duration-300 ${
                    personaType === 'simple' ? 'text-coral-600' : 'text-slate-500 group-hover:text-slate-600'
                  }`} />
                  <h4 className="text-lg font-medium text-slate-900">Simple (Regional) Persona</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  For tactical, regional personas that adapt the global standard 
                  to local market conditions.
                </p>
              </button>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <h3 className="text-xl font-medium text-slate-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-coral-600" />
              Provide the Source Material
            </h3>
            
            {/* File Upload */}
            <div
              className={`mb-6 border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                isDragOver
                  ? 'border-coral-500 bg-coral-50 shadow-lg'
                  : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="text-center">
                <Upload className="h-16 w-16 text-stone-400 mx-auto mb-6" />
                <p className="text-lg text-slate-700 mb-3 font-light">
                  Drag and drop your research document here, or{' '}
                  <label className="text-coral-600 hover:text-coral-700 cursor-pointer font-medium underline underline-offset-2">
                    browse to upload
                    <input
                      type="file"
                      accept=".txt,.docx,.doc"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-sm text-slate-500">
                  Supports .txt, .docx, and .doc files up to 10MB
                </p>
              </div>
            </div>

            {/* Text Area */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your persona research, customer interviews, market analysis, or any relevant content here..."
                className="w-full h-80 p-6 border-2 border-stone-200 rounded-2xl resize-none focus:ring-4 focus:ring-coral-100 focus:border-coral-500 transition-all duration-300 text-slate-700 leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 flex items-center text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-stone-200">
                <FileText className="h-4 w-4 mr-2" />
                {content.length.toLocaleString()} characters
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-xl font-medium text-slate-900 mb-6">
              Essential Context
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Region
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., global, uk, australia, north-america"
                  className="w-full p-4 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-coral-100 focus:border-coral-500 transition-all duration-300 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., ceo, chro, marketing, sales"
                  className="w-full p-4 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-coral-100 focus:border-coral-500 transition-all duration-300 text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full py-5 px-8 rounded-2xl font-medium text-lg transition-all duration-300 ${
                isFormValid
                  ? 'bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02]'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {isFormValid ? 'Generate Persona Intelligence' : 'Complete all fields to continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
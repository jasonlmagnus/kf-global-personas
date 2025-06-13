import React from 'react';
import { Check, RotateCcw, Sparkles, Target } from 'lucide-react';
import { PersonaData } from '../types/persona';
import DetailedPersonaCard from './DetailedPersonaCard';

interface ReviewStageProps {
  persona: PersonaData;
  onSave: () => void;
  onDiscard: () => void;
}

export default function ReviewStage({ persona, onSave, onDiscard }: ReviewStageProps) {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="text-center mb-12">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
          Your Persona Intelligence is Ready
        </h2>
        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
          Our AI has transformed your content into a comprehensive, actionable persona. 
          Review the intelligence below and <span className="text-coral-600 font-medium">approve for deployment</span>.
        </p>
      </div>

      <div className="mb-10">
        <DetailedPersonaCard persona={persona} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={onSave}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
          >
            <Check className="h-6 w-6" />
            <span>Deploy Persona Intelligence</span>
          </button>
          
          <button
            onClick={onDiscard}
            className="flex items-center justify-center space-x-3 bg-stone-600 hover:bg-stone-700 text-white px-10 py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
          >
            <RotateCcw className="h-6 w-6" />
            <span>Refine & Regenerate</span>
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Deploying will make this persona available across your growth strategy toolkit
          </p>
        </div>
      </div>
    </div>
  );
}
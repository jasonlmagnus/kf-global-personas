import React from 'react';
import { CheckCircle, Plus, Eye, Target } from 'lucide-react';

interface SuccessStateProps {
  personaName: string;
  onCreateAnother: () => void;
  onViewAll: () => void;
}

export default function SuccessState({ personaName, onCreateAnother, onViewAll }: SuccessStateProps) {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-12 text-center">
          <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-light text-white mb-3">
            Persona Intelligence Deployed Successfully
          </h2>
          <p className="text-emerald-100 text-lg font-light">
            <strong className="font-medium">{personaName}</strong> is now active in your growth intelligence system
          </p>
        </div>

        <div className="p-10 text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 text-slate-600 mb-4">
              <Target className="h-5 w-5 text-coral-600" />
              <span className="font-medium">Ready for Strategic Deployment</span>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Your persona is now integrated and ready to drive better growth outcomes across 
              marketing campaigns, content strategy, and customer experience initiatives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onCreateAnother}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Create Another Persona</span>
            </button>
            
            <button
              onClick={onViewAll}
              className="flex items-center justify-center space-x-3 bg-stone-600 hover:bg-stone-700 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <Eye className="h-5 w-5" />
              <span>View Intelligence Library</span>
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-200">
            <p className="text-sm text-slate-500">
              Part of the Magnus Consulting Growth Intelligence Suite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
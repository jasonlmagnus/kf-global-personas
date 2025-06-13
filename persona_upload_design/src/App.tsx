import React, { useState } from 'react';
import InputStage from './components/InputStage';
import ProcessingStage from './components/ProcessingStage';
import ReviewStage from './components/ReviewStage';
import SuccessState from './components/SuccessState';
import { PersonaData } from './types/persona';
import { generateMockPersona } from './utils/mockPersonaGenerator';

type AppStage = 'input' | 'processing' | 'review' | 'success';

interface InputData {
  type: 'advanced' | 'simple';
  content: string;
  region: string;
  department: string;
}

function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('input');
  const [inputData, setInputData] = useState<InputData | null>(null);
  const [generatedPersona, setGeneratedPersona] = useState<PersonaData | null>(null);

  // Mock data for demonstration
  const mockInputData: InputData = {
    type: 'advanced',
    content: 'Sample persona content for demonstration purposes...',
    region: 'global',
    department: 'marketing'
  };

  const mockPersona = generateMockPersona(
    mockInputData.type,
    mockInputData.content,
    mockInputData.region,
    mockInputData.department
  );

  const handleGenerate = (data: InputData) => {
    setInputData(data);
    setCurrentStage('processing');
  };

  const handleProcessingComplete = () => {
    if (inputData) {
      const persona = generateMockPersona(
        inputData.type,
        inputData.content,
        inputData.region,
        inputData.department
      );
      setGeneratedPersona(persona);
      setCurrentStage('review');
    }
  };

  const handleSave = () => {
    console.log('Saving persona:', generatedPersona);
    setCurrentStage('success');
  };

  const handleDiscard = () => {
    setCurrentStage('input');
    setInputData(null);
    setGeneratedPersona(null);
  };

  const handleCreateAnother = () => {
    setCurrentStage('input');
    setInputData(null);
    setGeneratedPersona(null);
  };

  const handleViewAll = () => {
    console.log('Navigate to personas list');
    alert('In a real app, this would navigate to your persona library');
  };

  // Navigation handlers for mockup
  const handleStageClick = (stage: AppStage) => {
    setCurrentStage(stage);
    
    // Set mock data when navigating to stages that need it
    if (stage === 'processing' || stage === 'review' || stage === 'success') {
      if (!inputData) {
        setInputData(mockInputData);
      }
      if (!generatedPersona && (stage === 'review' || stage === 'success')) {
        setGeneratedPersona(mockPersona);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-slate-900 tracking-tight">
                Magnus Consulting
              </h1>
              <p className="text-sm text-coral-500 font-medium tracking-wide uppercase mt-1">
                Persona Intelligence Engine
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="text-xs text-slate-600">
                <div className="font-medium">Certified</div>
                <div>B Corporation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {currentStage !== 'success' && (
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-12">
                <button
                  onClick={() => handleStageClick('input')}
                  className={`flex items-center space-x-3 transition-all duration-300 hover:opacity-80 group ${
                    currentStage === 'input' ? 'text-coral-600' : 'text-emerald-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 group-hover:scale-105 ${
                    currentStage === 'input' ? 'bg-coral-100 text-coral-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    1
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Briefing</div>
                    <div className="text-xs text-slate-500">Define requirements</div>
                  </div>
                </button>
                
                <div className={`h-px w-16 transition-all duration-300 ${
                  ['processing', 'review'].includes(currentStage) ? 'bg-coral-300' : 'bg-stone-300'
                }`}></div>
                
                <button
                  onClick={() => handleStageClick('processing')}
                  className={`flex items-center space-x-3 transition-all duration-300 hover:opacity-80 group ${
                    currentStage === 'processing' ? 'text-coral-600' : 
                    currentStage === 'review' ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 group-hover:scale-105 ${
                    currentStage === 'processing' ? 'bg-coral-100 text-coral-700' : 
                    currentStage === 'review' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-slate-500'
                  }`}>
                    2
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Creation</div>
                    <div className="text-xs text-slate-500">AI processing</div>
                  </div>
                </button>
                
                <div className={`h-px w-16 transition-all duration-300 ${
                  currentStage === 'review' ? 'bg-coral-300' : 'bg-stone-300'
                }`}></div>
                
                <button
                  onClick={() => handleStageClick('review')}
                  className={`flex items-center space-x-3 transition-all duration-300 hover:opacity-80 group ${
                    currentStage === 'review' ? 'text-coral-600' : 'text-slate-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 group-hover:scale-105 ${
                    currentStage === 'review' ? 'bg-coral-100 text-coral-700' : 'bg-stone-100 text-slate-500'
                  }`}>
                    3
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Review</div>
                    <div className="text-xs text-slate-500">Final approval</div>
                  </div>
                </button>
              </div>
              
              {/* Mockup indicator */}
              <div className="text-xs text-slate-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
                <span className="font-medium text-amber-700">Demo Mode</span>
                <span className="text-slate-500 ml-2">Click stages to navigate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-12">
        {currentStage === 'input' && (
          <InputStage onGenerate={handleGenerate} />
        )}
        
        {currentStage === 'processing' && (
          <ProcessingStage 
            personaType={inputData?.type || 'advanced'}
            onComplete={handleProcessingComplete}
          />
        )}
        
        {currentStage === 'review' && (
          <ReviewStage 
            persona={generatedPersona || mockPersona}
            onSave={handleSave}
            onDiscard={handleDiscard}
          />
        )}
        
        {currentStage === 'success' && (
          <SuccessState 
            personaName={generatedPersona?.name || mockPersona.name}
            onCreateAnother={handleCreateAnother}
            onViewAll={handleViewAll}
          />
        )}
      </div>
    </div>
  );
}

export default App;
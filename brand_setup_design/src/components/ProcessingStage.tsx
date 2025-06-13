import React, { useState, useEffect } from 'react';
import { Loader2, Brain, FileSearch, Lightbulb, Zap, Target } from 'lucide-react';
import { ProcessingMessage } from '../types/persona';

interface ProcessingStageProps {
  personaType: 'advanced' | 'simple';
  onComplete: () => void;
}

export default function ProcessingStage({ personaType, onComplete }: ProcessingStageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ProcessingMessage[]>([
    { id: 1, message: "Analyzing your research content and extracting key insights...", completed: false },
    { id: 2, message: "Identifying behavioral patterns and demographic indicators...", completed: false },
    { id: 3, message: `Mapping insights to the ${personaType === 'advanced' ? 'Advanced Global' : 'Regional'} Persona framework...`, completed: false },
    { id: 4, message: "Synthesizing psychographic profiles and pain point analysis...", completed: false },
    { id: 5, message: "Finalizing your intelligent persona structure...", completed: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < messages.length - 1) {
          setMessages((msgs) =>
            msgs.map((msg, idx) =>
              idx === prev ? { ...msg, completed: true } : msg
            )
          );
          return prev + 1;
        } else {
          setMessages((msgs) =>
            msgs.map((msg, idx) =>
              idx === prev ? { ...msg, completed: true } : msg
            )
          );
          setTimeout(() => onComplete(), 1500);
          clearInterval(interval);
          return prev;
        }
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [messages.length, onComplete]);

  const getStepIcon = (stepIndex: number) => {
    const icons = [FileSearch, Brain, Target, Lightbulb, Zap];
    const Icon = icons[stepIndex] || Loader2;
    
    if (stepIndex < currentStep) {
      return <Icon className="h-7 w-7 text-emerald-600" />;
    } else if (stepIndex === currentStep) {
      return <Icon className="h-7 w-7 text-coral-600 animate-pulse" />;
    } else {
      return <Icon className="h-7 w-7 text-stone-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-8 py-8">
          <div className="flex items-center space-x-4 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-light mb-1">
                AI Intelligence Processing
              </h2>
              <p className="text-coral-100 font-light">
                Transforming your content into actionable persona intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="space-y-8">
            {messages.map((message, index) => (
              <div key={message.id} className="flex items-start space-x-6">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(index)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-lg leading-relaxed transition-all duration-500 ${
                    message.completed 
                      ? 'text-emerald-700 font-medium' 
                      : index === currentStep 
                        ? 'text-coral-700 font-medium' 
                        : 'text-stone-500'
                  }`}>
                    {message.message}
                  </p>
                  {index === currentStep && (
                    <div className="mt-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-coral-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-coral-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-coral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                {message.completed && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="bg-stone-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-coral-500 to-coral-600 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((currentStep + 1) / messages.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-slate-600 font-medium">
                Processing Step {currentStep + 1} of {messages.length}
              </p>
              <p className="text-sm text-coral-600 font-medium">
                {Math.round(((currentStep + 1) / messages.length) * 100)}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
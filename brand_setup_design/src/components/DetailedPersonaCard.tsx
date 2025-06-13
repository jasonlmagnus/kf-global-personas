import React from 'react';
import { User, MapPin, Building, Heart, Target, AlertCircle, MessageSquare, Calendar, Globe, TrendingUp } from 'lucide-react';
import { PersonaData } from '../types/persona';

interface DetailedPersonaCardProps {
  persona: PersonaData;
}

export default function DetailedPersonaCard({ persona }: DetailedPersonaCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-light mb-2">{persona.name}</h2>
              <div className="flex items-center space-x-6 text-slate-300">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-light">{persona.region}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span className="font-light">{persona.department}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-slate-300 mb-2">
              <Globe className="h-5 w-5" />
              <span className="font-medium capitalize">{persona.type} Persona</span>
            </div>
            <div className="flex items-center space-x-2 text-coral-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Growth Intelligence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Quote */}
        <div className="bg-coral-50 p-6 rounded-2xl border-l-4 border-coral-400">
          <MessageSquare className="h-6 w-6 text-coral-600 mb-3" />
          <blockquote className="text-coral-900 italic font-medium text-lg leading-relaxed">
            "{persona.quote}"
          </blockquote>
        </div>

        {/* Demographics */}
        <div>
          <h3 className="text-xl font-medium text-slate-900 mb-6 flex items-center">
            <User className="h-6 w-6 mr-3 text-coral-600" />
            Demographics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <p className="text-sm text-slate-600 mb-1">Age</p>
              <p className="font-medium text-slate-900">{persona.demographics.age}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <p className="text-sm text-slate-600 mb-1">Gender</p>
              <p className="font-medium text-slate-900">{persona.demographics.gender}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <p className="text-sm text-slate-600 mb-1">Location</p>
              <p className="font-medium text-slate-900">{persona.demographics.location}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <p className="text-sm text-slate-600 mb-1">Income</p>
              <p className="font-medium text-slate-900">{persona.demographics.income}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 col-span-2">
              <p className="text-sm text-slate-600 mb-1">Education</p>
              <p className="font-medium text-slate-900">{persona.demographics.education}</p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div>
          <h3 className="text-xl font-medium text-slate-900 mb-6 flex items-center">
            <Target className="h-6 w-6 mr-3 text-emerald-600" />
            Goals & Motivations
          </h3>
          <div className="space-y-4">
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
              <h4 className="font-medium text-emerald-900 mb-3">Primary Goal</h4>
              <p className="text-emerald-800 leading-relaxed">{persona.goals.primary}</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Secondary Goals</h4>
              <ul className="space-y-2">
                {persona.goals.secondary.map((goal, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700 leading-relaxed">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <h3 className="text-xl font-medium text-slate-900 mb-6 flex items-center">
            <AlertCircle className="h-6 w-6 mr-3 text-red-600" />
            Pain Points & Challenges
          </h3>
          <div className="space-y-3">
            {persona.painPoints.map((pain, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-800 leading-relaxed">{pain}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Psychographics */}
        <div>
          <h3 className="text-xl font-medium text-slate-900 mb-6 flex items-center">
            <Heart className="h-6 w-6 mr-3 text-purple-600" />
            Psychographics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3">Values</h4>
              <div className="flex flex-wrap gap-2">
                {persona.psychographics.values.map((value, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {persona.psychographics.interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3">Lifestyle</h4>
              <p className="text-purple-800 leading-relaxed">{persona.psychographics.lifestyle}</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3">Personality</h4>
              <p className="text-purple-800 leading-relaxed">{persona.psychographics.personality}</p>
            </div>
          </div>
        </div>

        {/* Behaviors */}
        <div>
          <h3 className="text-xl font-medium text-slate-900 mb-6">Key Behaviors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {persona.behaviors.map((behavior, index) => (
              <div key={index} className="flex items-start space-x-3 p-3">
                <div className="w-2 h-2 bg-coral-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-slate-700 leading-relaxed">{behavior}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div>
          <h3 className="text-xl font-medium text-slate-900 mb-6">Preferred Channels</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Primary Channels</h4>
              <div className="flex flex-wrap gap-2">
                {persona.channels.preferred.map((channel, index) => (
                  <span key={index} className="px-4 py-2 bg-coral-100 text-coral-800 rounded-full text-sm font-medium">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Channel Usage Patterns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(persona.channels.usage).map(([channel, usage]) => (
                  <div key={channel} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-medium text-slate-900">{channel}</span>
                    <span className="text-slate-600 text-sm">{usage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(persona.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-medium">Magnus Growth Intelligence</span>
              <span>ID: {persona.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
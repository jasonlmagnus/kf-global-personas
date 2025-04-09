import React from 'react';
import { ChevronDown, Globe, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-[#0B1529] text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Global Personas</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Persona Type</label>
              <div className="relative">
                <select className="w-full p-2 border rounded-md appearance-none bg-white pr-8">
                  <option>Role Personas</option>
                </select>
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Role</label>
              <div className="relative">
                <select className="w-full p-2 border rounded-md appearance-none bg-white pr-8">
                  <option>CEO</option>
                </select>
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Region</label>
              <div className="relative">
                <select className="w-full p-2 border rounded-md appearance-none bg-white pr-8">
                  <option>All Regions</option>
                </select>
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-[#0B1529] mb-6 flex items-center">
          <Globe className="mr-2 text-[#FF6B00]" />
          CEO Role Across Regions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* UK CEO Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&q=80"
                alt="London cityscape"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1529]/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-bold mb-2">UK CEO</h3>
                <button className="flex items-center text-white bg-[#FF6B00] px-4 py-2 rounded-md hover:bg-[#FF6B00]/90 transition-colors">
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* UAE CEO Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80"
                alt="Dubai skyline"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1529]/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-bold mb-2">UAE CEO</h3>
                <button className="flex items-center text-white bg-[#FF6B00] px-4 py-2 rounded-md hover:bg-[#FF6B00]/90 transition-colors">
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Australian CEO Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80"
                alt="Sydney opera house"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1529]/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-bold mb-2">Australian CEO</h3>
                <button className="flex items-center text-white bg-[#FF6B00] px-4 py-2 rounded-md hover:bg-[#FF6B00]/90 transition-colors">
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
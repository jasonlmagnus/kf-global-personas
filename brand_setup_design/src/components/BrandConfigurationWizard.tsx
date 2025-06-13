import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SketchPicker } from 'react-color';
import { Upload, X, Palette, Type, Eye, Save, RotateCcw, CheckCircle, Settings } from 'lucide-react';

interface BrandConfig {
  logo: string | null;
  primaryColor: string;
  textColor: string;
  fontFamily: string;
}

const defaultConfig: BrandConfig = {
  logo: null,
  primaryColor: '#ea7c4a',
  textColor: '#1e293b',
  fontFamily: 'Inter'
};

const availableFonts = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  { name: 'Nunito', value: 'Nunito' }
];

export default function BrandConfigurationWizard() {
  const [config, setConfig] = useState<BrandConfig>(defaultConfig);
  const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setConfig(prev => ({ ...prev, logo: reader.result as string }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.svg', '.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleColorChange = (color: any, type: 'primary' | 'text') => {
    setConfig(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryColor' : 'textColor']: color.hex
    }));
    setHasChanges(true);
  };

  const handleFontChange = (fontFamily: string) => {
    setConfig(prev => ({ ...prev, fontFamily }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setHasChanges(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setHasChanges(true);
  };

  const removeLogo = () => {
    setConfig(prev => ({ ...prev, logo: null }));
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-slate-900 tracking-tight">
                Magnus Consulting
              </h1>
              <p className="text-sm text-coral-500 font-medium tracking-wide uppercase mt-1">
                Brand Configuration Center
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-coral-100 to-coral-200 rounded-full flex items-center justify-center mb-6">
              <Settings className="h-10 w-10 text-coral-600" />
            </div>
            <h2 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
              Customize Your Brand Identity
            </h2>
            <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
              Configure your organization's visual identity to ensure consistent branding 
              across all <span className="text-coral-600 font-medium">persona intelligence tools</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-8">
              {/* Logo Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
                <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-8 py-6">
                  <div className="flex items-center space-x-3 text-white">
                    <Upload className="h-6 w-6" />
                    <h3 className="text-xl font-light">Brand Logo</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                      isDragActive
                        ? 'border-coral-500 bg-coral-50 shadow-lg'
                        : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {config.logo ? (
                      <div className="text-center">
                        <img
                          src={config.logo}
                          alt="Brand logo"
                          className="max-h-32 mx-auto mb-4 object-contain"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          className="flex items-center space-x-2 mx-auto text-red-600 hover:text-red-700 font-medium"
                        >
                          <X className="h-4 w-4" />
                          <span>Remove Logo</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-16 w-16 text-stone-400 mx-auto mb-6" />
                        <p className="text-lg text-slate-700 mb-3 font-light">
                          Drag and drop your logo here, or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          Supports SVG, PNG, and JPG files up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Scheme Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
                <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-8 py-6">
                  <div className="flex items-center space-x-3 text-white">
                    <Palette className="h-6 w-6" />
                    <h3 className="text-xl font-light">Color Scheme</h3>
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">
                      Primary / Accent Color
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setShowPrimaryColorPicker(!showPrimaryColorPicker)}
                        className="w-16 h-16 rounded-xl border-2 border-stone-300 shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ backgroundColor: config.primaryColor }}
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => handleColorChange({ hex: e.target.value }, 'primary')}
                        className="flex-1 p-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-coral-100 focus:border-coral-500 transition-all duration-300 font-mono"
                        placeholder="#ea7c4a"
                      />
                    </div>
                    {showPrimaryColorPicker && (
                      <div className="mt-4">
                        <SketchPicker
                          color={config.primaryColor}
                          onChange={(color) => handleColorChange(color, 'primary')}
                        />
                      </div>
                    )}
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">
                      Main Text Color
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                        className="w-16 h-16 rounded-xl border-2 border-stone-300 shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ backgroundColor: config.textColor }}
                      />
                      <input
                        type="text"
                        value={config.textColor}
                        onChange={(e) => handleColorChange({ hex: e.target.value }, 'text')}
                        className="flex-1 p-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-coral-100 focus:border-coral-500 transition-all duration-300 font-mono"
                        placeholder="#1e293b"
                      />
                    </div>
                    {showTextColorPicker && (
                      <div className="mt-4">
                        <SketchPicker
                          color={config.textColor}
                          onChange={(color) => handleColorChange(color, 'text')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Typography Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
                <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-8 py-6">
                  <div className="flex items-center space-x-3 text-white">
                    <Type className="h-6 w-6" />
                    <h3 className="text-xl font-light">Typography</h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Application Font
                  </label>
                  <select
                    value={config.fontFamily}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="w-full p-4 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-coral-100 focus:border-coral-500 transition-all duration-300 text-slate-700"
                  >
                    {availableFonts.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  
                  <div className="mt-6 p-6 bg-stone-50 rounded-2xl border border-stone-200">
                    <p 
                      className="text-lg leading-relaxed"
                      style={{ 
                        fontFamily: config.fontFamily,
                        color: config.textColor 
                      }}
                    >
                      The quick brown fox jumps over the lazy dog. This preview shows how your selected font will appear in the application.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                    <div className="flex items-center space-x-3 text-white">
                      <Eye className="h-5 w-5" />
                      <h3 className="text-lg font-light">Live Preview</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Sample Persona Card */}
                    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                      {config.logo && (
                        <div className="mb-4">
                          <img
                            src={config.logo}
                            alt="Brand logo"
                            className="h-8 object-contain"
                          />
                        </div>
                      )}
                      
                      <h4 
                        className="text-xl font-medium mb-3"
                        style={{ 
                          fontFamily: config.fontFamily,
                          color: config.textColor 
                        }}
                      >
                        Sample Persona Card
                      </h4>
                      
                      <p 
                        className="mb-4 leading-relaxed"
                        style={{ 
                          fontFamily: config.fontFamily,
                          color: config.textColor 
                        }}
                      >
                        This is how your brand styling will appear throughout the persona intelligence platform.
                      </p>
                      
                      <button
                        className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        Sample Button
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-medium text-lg transition-all duration-300 ${
                      hasChanges && !isSaving
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Brand...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Brand Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Save Brand</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center space-x-3 bg-stone-600 hover:bg-stone-700 text-white py-4 px-6 rounded-2xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Reset to Default</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
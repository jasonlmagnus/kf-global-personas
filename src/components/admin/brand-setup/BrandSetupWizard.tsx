"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import LogoUploader from "./LogoUploader";
import ColorSettings from "./ColorSettings";
import FontSettings from "./FontSettings";
import LivePreview from "./LivePreview";
import { BrandConfig, brandConfigSchema } from "@/lib/brandSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_LOGO_URL = "/kf-logo-white.svg"; // A known default

const BrandSetupWizard = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [settings, setSettings] = useState<BrandConfig | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  // Fetch the list of available brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // This is the correct endpoint for listing brands, restricted to admins
        const response = await fetch("/api/brands");
        if (!response.ok) throw new Error("Failed to fetch brand list.");
        const brandList: string[] = await response.json();
        setBrands(brandList);
        if (brandList.length > 0) {
          setSelectedBrand(brandList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch brands", error);
      }
    };
    fetchBrands();
  }, []);

  // Fetch the settings for the selected brand whenever it changes
  useEffect(() => {
    if (!selectedBrand) {
      setIsLoading(false);
      return;
    }

    const fetchBrandSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/brand?name=${selectedBrand}`);
        if (!response.ok) {
          throw new Error(`Could not load settings for ${selectedBrand}`);
        }
        const config: BrandConfig = await response.json();
        setSettings(config);
        setPreviewLogoUrl(config.logoUrl);
      } catch (error) {
        console.error(error);
        setSettings(null); // Clear settings on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrandSettings();
  }, [selectedBrand]);

  const handleFileSelect = (file: File | null) => {
    setLogoFile(file);
    setPreviewLogoUrl(
      file ? URL.createObjectURL(file) : settings?.logoUrl || null
    );
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setPreviewLogoUrl(DEFAULT_LOGO_URL);
    // Also update the settings in state so this change gets saved
    setSettings((prev) =>
      prev ? { ...prev, logoUrl: DEFAULT_LOGO_URL } : null
    );
  };

  const handleSettingsChange = (updatedSettings: Partial<BrandConfig>) => {
    setSettings((prev) => (prev ? { ...prev, ...updatedSettings } : null));
  };

  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) {
      toast.error("Please enter a name for the new brand.");
      return;
    }
    const sanitizedBrandName = newBrandName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (brands.includes(sanitizedBrandName)) {
      toast.error(`Brand "${sanitizedBrandName}" already exists.`);
      return;
    }

    setIsSaving(true);
    const defaultConfig: BrandConfig = {
      brandName: newBrandName.trim(),
      logoUrl: "/kf-logo-white.svg", // Default logo
      faviconUrl: "/favicon.ico",
      colors: {
        primary: "#3b82f6",
        secondary: "#6b7280",
        accent: "#3b82f6",
        text: "#111827",
        textLight: "#f9fafb",
        background: "#f9fafb",
        headerText: "#ffffff",
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        googleFontUrl:
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
      },
      navigation: [
        { name: "Personas", path: "/personas" },
        { name: "Upload", path: "/admin/upload" },
        { name: "Brand Setup", path: "/admin/brand-setup" },
      ],
      footer: { copyrightName: newBrandName.trim(), links: [] },
      chatbot: {
        headerColor: "#3b82f6",
        assistantName: `${newBrandName.trim()} Assistant`,
        assistantSubtitle: "Online",
        welcomeMessage: "How can I help you?",
        userBubbleColor: "#d1d5db",
        assistantBubbleColor: "#3b82f6",
      },
    };

    try {
      brandConfigSchema.parse(defaultConfig);
      const response = await fetch(`/api/brand?name=${sanitizedBrandName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultConfig),
      });

      if (!response.ok) throw new Error("Failed to create new brand.");
      toast.success(`Brand "${sanitizedBrandName}" created successfully!`);

      setBrands([...brands, sanitizedBrandName].sort());
      setSelectedBrand(sanitizedBrandName);
      setNewBrandName("");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    if (!confirm(`Delete brand "${selectedBrand}"? A backup will be created.`)) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/brand/delete?name=${selectedBrand}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete brand.');
      const updated = brands.filter(b => b !== selectedBrand);
      setBrands(updated);
      setSelectedBrand(updated[0] || '');
      toast.success(`Brand "${selectedBrand}" deleted.`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloneBrand = async () => {
    if (!selectedBrand) return;
    const newName = prompt('Enter name for cloned brand:');
    if (!newName) return;
    const sanitized = newName.trim().toLowerCase().replace(/\s+/g, '-');
    if (brands.includes(sanitized)) {
      toast.error(`Brand "${sanitized}" already exists.`);
      return;
    }
    if (!confirm(`Clone "${selectedBrand}" to "${newName}"?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/brand/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: selectedBrand, newName }),
      });
      if (!res.ok) throw new Error('Failed to clone brand.');
      setBrands([...brands, sanitized].sort());
      setSelectedBrand(sanitized);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenameBrand = async () => {
    if (!selectedBrand) return;
    const newName = prompt('Enter new name for brand:');
    if (!newName) return;
    const sanitized = newName.trim().toLowerCase().replace(/\s+/g, '-');
    if (brands.includes(sanitized)) {
      toast.error(`Brand "${sanitized}" already exists.`);
      return;
    }
    if (!confirm(`Rename "${selectedBrand}" to "${newName}"?`)) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/brand/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName: selectedBrand, newName }),
      });
      if (!res.ok) throw new Error('Failed to rename brand.');
      const updated = brands.map(b => (b === selectedBrand ? sanitized : b)).sort();
      setBrands(updated);
      setSelectedBrand(sanitized);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!settings || !selectedBrand) return;
    setIsSaving(true);

    try {
      brandConfigSchema.parse(settings);

      const formData = new FormData();
      formData.append("settings", JSON.stringify(settings));
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch(`/api/brand?name=${selectedBrand}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save brand settings.");
      }

      toast.success(
        `Brand "${selectedBrand}" saved successfully! The page will now reload to apply the changes.`
      );

      // Force a reload to make the new theme active across the app
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <label
          htmlFor="brand-selector"
          className="block text-lg font-medium text-slate-800 mb-3"
        >
          Select Brand to Edit
        </label>
        <Select
          value={selectedBrand}
          onValueChange={setSelectedBrand}
          disabled={brands.length === 0}
        >
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Select a brand..." />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand.charAt(0).toUpperCase() + brand.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-medium text-slate-800 mb-3">
          Create New Brand
        </h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="Enter New Brand Name"
            className="w-full max-w-sm p-3 border-2 border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleCreateBrand}
            disabled={isSaving}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition-all"
          >
            {isSaving ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading brand settings...</div>
      ) : !settings ? (
        <div>Could not load settings for brand: {selectedBrand}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <LogoUploader
              logoPath={previewLogoUrl}
              onFileSelect={handleFileSelect}
              onLogoRemove={handleLogoRemove}
            />
            <ColorSettings
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
            <FontSettings
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          </div>
          <div className="lg:col-span-1">
            <LivePreview settings={settings} />
          </div>
          <div className="lg:col-span-3 flex justify-between mt-4 flex-wrap gap-2">
            <div className="space-x-2">
              <button
                onClick={handleCloneBrand}
                disabled={isSaving}
                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 transition-all"
              >
                Clone
              </button>
              <button
                onClick={handleRenameBrand}
                disabled={isSaving}
                className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 disabled:bg-gray-400 transition-all"
              >
                Rename
              </button>
              <button
                onClick={handleDeleteBrand}
                disabled={isSaving}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400 transition-all"
              >
                Delete
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-all"
            >
              {isSaving ? "Saving..." : `Save "${selectedBrand}" Brand`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSetupWizard;

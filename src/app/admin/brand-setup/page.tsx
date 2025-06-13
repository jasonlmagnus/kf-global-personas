"use client";

import React from "react";
import BrandSetupWizard from "@/components/admin/brand-setup/BrandSetupWizard";

const BrandSetupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Brand Configuration
        </h1>
        <p className="text-slate-600 mb-8">
          Customize the look and feel of the application to match your brand.
        </p>
        <BrandSetupWizard />
      </div>
    </div>
  );
};

export default BrandSetupPage;

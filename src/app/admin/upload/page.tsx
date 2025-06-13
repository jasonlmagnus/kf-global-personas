"use client";

import React from "react";
import PersonaUploadWizard from "@/components/admin/upload/PersonaUploadWizard";

const PersonaUploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      {/* 
        This outer container matches the background from your reference design.
        The header/progress bar can be part of the Wizard itself or a shared AdminLayout later.
        For now, the wizard is self-contained.
      */}
      <PersonaUploadWizard />
    </div>
  );
};

export default PersonaUploadPage;

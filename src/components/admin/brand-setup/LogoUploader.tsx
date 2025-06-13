"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

interface LogoUploaderProps {
  logoPath: string | null;
  onFileSelect: (file: File | null) => void;
  onLogoRemove: () => void; // Add a specific handler for removal
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  logoPath,
  onFileSelect,
  onLogoRemove,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg+xml": [],
    },
    multiple: false,
  });

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogoRemove();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Brand Logo</h3>

      {logoPath ? (
        // View when logo is present
        <div className="relative w-40 h-40 group">
          <img
            src={logoPath}
            alt="Brand Logo Preview"
            className="w-full h-full object-contain rounded-lg border border-slate-200"
          />
          <button
            onClick={handleRemoveClick}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            aria-label="Remove logo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        // View for uploading a logo
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 hover:border-blue-400"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-slate-500">
            <UploadCloud className="w-12 h-12 mb-4" />
            <p className="font-semibold">
              <span className="text-blue-600">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs mt-1">SVG, PNG, or JPG</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;

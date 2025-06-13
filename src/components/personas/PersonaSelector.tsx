"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Region, Department, ConfigItem } from "../../types/personas";

interface PersonaSelectorProps {
  viewType: "single" | "role" | "region";
  setViewType: (value: "single" | "role" | "region") => void;
  selectedDepartment: Department | null;
  setSelectedDepartment: (value: Department | null) => void;
  selectedRegion: Region | null;
  setSelectedRegion: (value: Region | null) => void;
  dynamicDepartments: ConfigItem[];
  dynamicRegions: ConfigItem[];
  isLoadingConfig: boolean;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  viewType,
  setViewType,
  selectedDepartment,
  setSelectedDepartment,
  selectedRegion,
  setSelectedRegion,
  dynamicDepartments,
  dynamicRegions,
  isLoadingConfig,
}) => {
  return (
    <div className="nav-filters">
      <div className="filter-container">
        <div className="filter-item">
          <label className="selector-label">Persona Type</label>
          <div className="selector-wrapper">
            <select
              className="selector"
              value={viewType}
              onChange={(e) =>
                setViewType(e.target.value as "single" | "role" | "region")
              }
            >
              <option value="single">Single Persona</option>
              <option value="role">Role Personas</option>
              <option value="region">Region Personas</option>
            </select>
            <ChevronDown className="selector-icon" />
          </div>
        </div>
        <div className="filter-item">
          <label className="selector-label">Role</label>
          <div className="selector-wrapper">
            {viewType === "region" ? (
              <div className="relative w-full">
                <select
                  className="selector bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled={true}
                  tabIndex={-1}
                >
                  <option value="n/a">N/A</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ) : (
              <>
                <select
                  className="selector"
                  value={selectedDepartment || ""}
                  onChange={(e) =>
                    setSelectedDepartment(
                      e.target.value ? (e.target.value as Department) : null
                    )
                  }
                  disabled={isLoadingConfig || dynamicDepartments.length === 0}
                >
                  {isLoadingConfig ? (
                    <option>Loading...</option>
                  ) : dynamicDepartments.length === 0 ? (
                    <option>N/A</option>
                  ) : (
                    <>
                      <option value="">Select Role</option>
                      {dynamicDepartments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="selector-icon" />
              </>
            )}
          </div>
        </div>
        <div className="filter-item">
          <label className="selector-label">Region</label>
          <div className="selector-wrapper">
            {viewType === "role" ? (
              <div className="relative w-full">
                <select
                  className="selector bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled={true}
                  tabIndex={-1}
                >
                  <option value="n/a">N/A</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ) : (
              <>
                <select
                  className="selector"
                  value={selectedRegion || ""}
                  onChange={(e) =>
                    setSelectedRegion(
                      e.target.value ? (e.target.value as Region) : null
                    )
                  }
                  disabled={isLoadingConfig || dynamicRegions.length === 0}
                >
                  {isLoadingConfig ? (
                    <option>Loading...</option>
                  ) : dynamicRegions.length === 0 ? (
                    <option>N/A</option>
                  ) : (
                    <>
                      <option value="">Select Region</option>
                      {dynamicRegions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <ChevronDown className="selector-icon" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelector;

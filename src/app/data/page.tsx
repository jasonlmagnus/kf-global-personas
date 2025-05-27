"use client";

import React, { useState } from "react";
import CEOSurveyDashboard from "@/components/data/dashboards/CEOSurveyDashboard";
import CHROSurveyDashboard from "@/components/data/dashboards/CHROSurveyDashboard";
import StrategicPrioritiesDashboard from "@/components/data/dashboards/StrategicPrioritiesDashboard";
import { ChevronDown } from "lucide-react";

export default function DataPage() {
  const [selectedDashboard, setSelectedDashboard] = useState<
    "ceo" | "chro" | "strategic"
  >("ceo");

  return (
    <div className="p-6">
      <div className="nav-filters mb-6">
        <div className="filter-container">
          <div className="filter-item">
            <label className="selector-label">Select Dashboard</label>
            <div className="selector-wrapper">
              <select
                className="selector"
                value={selectedDashboard}
                onChange={(e) =>
                  setSelectedDashboard(
                    e.target.value as "ceo" | "chro" | "strategic"
                  )
                }
              >
                <option value="ceo">CEO Survey Dashboard</option>
                <option value="chro">
                  Senior Executive (CHRO Proxy) Dashboard
                </option>
                <option value="strategic">Senior Leader Survey</option>
              </select>
              <ChevronDown className="selector-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {selectedDashboard === "ceo" ? (
          <CEOSurveyDashboard />
        ) : selectedDashboard === "chro" ? (
          <CHROSurveyDashboard />
        ) : selectedDashboard === "strategic" ? (
          <StrategicPrioritiesDashboard />
        ) : null}
      </div>
    </div>
  );
}

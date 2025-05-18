"use client";

import React from "react";
import CEOSurveyDashboard from "../../components/data/dashboards/CEOSurveyDashboard";

export default function DataPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Data Page</h1>
      <p className="mb-4">
        Future content related to data will be displayed here. Currently
        displaying the CEO Survey Dashboard:
      </p>

      <div className="mt-4">
        <CEOSurveyDashboard />
      </div>
    </div>
  );
}

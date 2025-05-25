"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Survey Response Interface
interface SurveyResponse {
  companySize: string;
  country: string;
  industry: string;
  jobTitle: string;
  jobFunction: string;
  decisionMaking: string;
  boardStatus: string;
  q2_growth: number;
  q2_innovation: number;
  q2_transformation: number;
  q2_ai_technology: number;
  q2_cost_efficiency: number;
  q2_skills_future: number;
  q2_culture_change: number;
  q2_risk_reputation: number;
  q2_sustainability_esg: number;
  q3_economic_uncertainty: number;
  q3_political_uncertainty: number;
  q3_sustainability_transition: number;
  q3_regulatory_changes: number;
  q3_supply_chain: number;
  q3_labor_skills_shortage: number;
  q3_technological_changes: number;
  q3_industry_convergence: number;
  q3_consumer_behaviors: number;
  q3_activist_behaviors: number;
  q3_ma_restructuring: number;
  q3_competitive_innovation: number;
  q4_lack_productivity: number;
  q4_lack_engagement: number;
  q4_return_office_resistance: number;
  q4_flexibility_requests: number;
  q4_alignment_goals: number;
  q4_ai_resistance: number;
  q4_generational_challenges: number;
  q4_change_fatigue: number;
  challenges?: string;
  capability_gaps?: string;
  consulting_preferences?: string;
}

// Dashboard Data Interface
interface DashboardData {
  totalResponses: number;
  allResponses: SurveyResponse[];
  strategicPriorities: { [key: string]: number };
  externalTrends: { [key: string]: number };
  organizationalProblems: { [key: string]: number };
  availablePersonas: string[];
  availableIndustries: string[];
  availableCountries: string[];
}

// Filtered Results Interface
interface FilteredResults {
  responses: SurveyResponse[];
  sampleSize: number;
  strategicPriorities: { [key: string]: number };
  externalTrends: { [key: string]: number };
  organizationalProblems: { [key: string]: number };
}

// Data cleaning functions
const cleanJobTitle = (title: string): string => {
  if (!title || typeof title !== "string") return "Unknown";

  const cleaned = title
    .replace(/^[^a-zA-Z]*/, "")
    .replace(/[?:]/g, "")
    .replace(/\b(what|which|how|when|where|why|who)\b/gi, "")
    .trim();

  if (cleaned.length < 2 || cleaned.toLowerCase().includes("question")) {
    return "Unknown";
  }

  // Map to standard roles
  const lowerTitle = cleaned.toLowerCase();
  if (lowerTitle.includes("ceo") || lowerTitle.includes("chief executive"))
    return "CEO";
  if (lowerTitle.includes("cto") || lowerTitle.includes("chief technology"))
    return "CTO";
  if (lowerTitle.includes("cfo") || lowerTitle.includes("chief financial"))
    return "CFO";
  if (lowerTitle.includes("cmo") || lowerTitle.includes("chief marketing"))
    return "CMO";
  if (lowerTitle.includes("chro") || lowerTitle.includes("chief human"))
    return "CHRO";
  if (lowerTitle.includes("cio") || lowerTitle.includes("chief information"))
    return "CIO";
  if (lowerTitle.includes("head")) return "Head";
  if (lowerTitle.includes("senior vp") || lowerTitle.includes("senior vice"))
    return "Senior VP";
  if (lowerTitle.includes("vp") || lowerTitle.includes("vice president"))
    return "VP";
  if (lowerTitle.includes("director")) return "Director";

  return cleaned;
};

const cleanIndustry = (industry: string): string => {
  if (!industry || typeof industry !== "string") return "Unknown";

  const cleaned = industry
    .replace(/[?:]/g, "")
    .replace(/\b(what|which|how|when|where|why|who)\b/gi, "")
    .trim();

  if (cleaned.length < 2 || cleaned.toLowerCase().includes("question")) {
    return "Unknown";
  }

  return cleaned;
};

const cleanCountry = (country: string): string => {
  if (!country || typeof country !== "string") return "Unknown";

  const cleaned = country
    .replace(/[?:]/g, "")
    .replace(/\b(what|which|how|when|where|why|who)\b/gi, "")
    .trim();

  if (cleaned.length < 2 || cleaned.toLowerCase().includes("question")) {
    return "Unknown";
  }

  return cleaned;
};

// CSV parsing function
const parseCSV = (csvText: string): SurveyResponse[] => {
  const lines = csvText.split("\n");
  const responses: SurveyResponse[] = [];

  for (let i = 7; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || !line.startsWith("I agree")) continue;

    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= 42) {
      const response: SurveyResponse = {
        companySize: values[1] || "",
        country: cleanCountry(values[2]),
        industry: cleanIndustry(values[3]),
        jobTitle: cleanJobTitle(values[5]),
        jobFunction: values[6] || "",
        decisionMaking: values[7] || "",
        boardStatus: values[8] || "",
        q2_growth: parseInt(values[10]) || 0,
        q2_innovation: parseInt(values[11]) || 0,
        q2_transformation: parseInt(values[12]) || 0,
        q2_ai_technology: parseInt(values[13]) || 0,
        q2_cost_efficiency: parseInt(values[14]) || 0,
        q2_skills_future: parseInt(values[15]) || 0,
        q2_culture_change: parseInt(values[16]) || 0,
        q2_risk_reputation: parseInt(values[17]) || 0,
        q2_sustainability_esg: parseInt(values[18]) || 0,
        q3_economic_uncertainty: parseInt(values[20]) || 0,
        q3_political_uncertainty: parseInt(values[21]) || 0,
        q3_sustainability_transition: parseInt(values[22]) || 0,
        q3_regulatory_changes: parseInt(values[23]) || 0,
        q3_supply_chain: parseInt(values[24]) || 0,
        q3_labor_skills_shortage: parseInt(values[25]) || 0,
        q3_technological_changes: parseInt(values[26]) || 0,
        q3_industry_convergence: parseInt(values[27]) || 0,
        q3_consumer_behaviors: parseInt(values[28]) || 0,
        q3_activist_behaviors: parseInt(values[29]) || 0,
        q3_ma_restructuring: parseInt(values[30]) || 0,
        q3_competitive_innovation: parseInt(values[31]) || 0,
        q4_lack_productivity: parseInt(values[33]) || 0,
        q4_lack_engagement: parseInt(values[34]) || 0,
        q4_return_office_resistance: parseInt(values[35]) || 0,
        q4_flexibility_requests: parseInt(values[36]) || 0,
        q4_alignment_goals: parseInt(values[37]) || 0,
        q4_ai_resistance: parseInt(values[38]) || 0,
        q4_generational_challenges: parseInt(values[39]) || 0,
        q4_change_fatigue: parseInt(values[40]) || 0,
        challenges: values[41] || "",
        capability_gaps: values[42] || "",
        consulting_preferences: values[43] || "",
      };

      responses.push(response);
    }
  }

  return responses;
};

// Calculate percentages for a field
const calculatePercentages = (
  responses: SurveyResponse[],
  field: keyof SurveyResponse
): number => {
  if (responses.length === 0) return 0;
  const count = responses.filter((r) => r[field] === 1).length;
  return Math.round((count / responses.length) * 100);
};

// Process data function
const processData = (responses: SurveyResponse[]): DashboardData => {
  // Filter out invalid responses
  const validResponses = responses.filter(
    (r) =>
      r.country !== "Unknown" &&
      r.industry !== "Unknown" &&
      r.jobTitle !== "Unknown"
  );

  // Calculate overall percentages
  const strategicPriorities = {
    "Growth & Market Expansion": calculatePercentages(
      validResponses,
      "q2_growth"
    ),
    Innovation: calculatePercentages(validResponses, "q2_innovation"),
    Transformation: calculatePercentages(validResponses, "q2_transformation"),
    "AI & Technology": calculatePercentages(validResponses, "q2_ai_technology"),
    "Cost Efficiency": calculatePercentages(
      validResponses,
      "q2_cost_efficiency"
    ),
    "Skills for Future": calculatePercentages(
      validResponses,
      "q2_skills_future"
    ),
    "Culture Change": calculatePercentages(validResponses, "q2_culture_change"),
    "Risk Management": calculatePercentages(
      validResponses,
      "q2_risk_reputation"
    ),
    "Sustainability & ESG": calculatePercentages(
      validResponses,
      "q2_sustainability_esg"
    ),
  };

  const externalTrends = {
    "Economic Uncertainty": calculatePercentages(
      validResponses,
      "q3_economic_uncertainty"
    ),
    "Political Uncertainty": calculatePercentages(
      validResponses,
      "q3_political_uncertainty"
    ),
    "Sustainability Transition": calculatePercentages(
      validResponses,
      "q3_sustainability_transition"
    ),
    "Regulatory Changes": calculatePercentages(
      validResponses,
      "q3_regulatory_changes"
    ),
    "Supply Chain Issues": calculatePercentages(
      validResponses,
      "q3_supply_chain"
    ),
    "Labor Shortages": calculatePercentages(
      validResponses,
      "q3_labor_skills_shortage"
    ),
    "Technology Changes": calculatePercentages(
      validResponses,
      "q3_technological_changes"
    ),
    "Industry Convergence": calculatePercentages(
      validResponses,
      "q3_industry_convergence"
    ),
    "Consumer Behavior": calculatePercentages(
      validResponses,
      "q3_consumer_behaviors"
    ),
    "Activist Behaviors": calculatePercentages(
      validResponses,
      "q3_activist_behaviors"
    ),
    "M&A Activity": calculatePercentages(validResponses, "q3_ma_restructuring"),
    "Competitive Innovation": calculatePercentages(
      validResponses,
      "q3_competitive_innovation"
    ),
  };

  const organizationalProblems = {
    "Lack of Productivity": calculatePercentages(
      validResponses,
      "q4_lack_productivity"
    ),
    "Lack of Engagement": calculatePercentages(
      validResponses,
      "q4_lack_engagement"
    ),
    "Return to Office Resistance": calculatePercentages(
      validResponses,
      "q4_return_office_resistance"
    ),
    "Flexibility Requests": calculatePercentages(
      validResponses,
      "q4_flexibility_requests"
    ),
    "Goal Alignment Issues": calculatePercentages(
      validResponses,
      "q4_alignment_goals"
    ),
    "AI Resistance": calculatePercentages(validResponses, "q4_ai_resistance"),
    "Generational Challenges": calculatePercentages(
      validResponses,
      "q4_generational_challenges"
    ),
    "Change Fatigue": calculatePercentages(validResponses, "q4_change_fatigue"),
  };

  // Get unique values for filters
  const availablePersonas = Array.from(
    new Set(validResponses.map((r) => r.jobTitle))
  ).sort();
  const availableIndustries = Array.from(
    new Set(validResponses.map((r) => r.industry))
  ).sort();
  const availableCountries = Array.from(
    new Set(validResponses.map((r) => r.country))
  ).sort();

  return {
    totalResponses: validResponses.length,
    allResponses: validResponses,
    strategicPriorities,
    externalTrends,
    organizationalProblems,
    availablePersonas,
    availableIndustries,
    availableCountries,
  };
};

// Apply filters function - THIS IS THE KEY FIX
const applyFilters = (
  data: DashboardData,
  selectedPersona: string,
  selectedIndustry: string,
  selectedCountry: string
): FilteredResults => {
  // Filter responses using AND logic for multi-dimensional filtering
  const filteredResponses = data.allResponses.filter((response) => {
    const matchesPersona =
      selectedPersona === "All" || response.jobTitle === selectedPersona;
    const matchesIndustry =
      selectedIndustry === "All" || response.industry === selectedIndustry;
    const matchesCountry =
      selectedCountry === "All" || response.country === selectedCountry;

    // ALL conditions must be true (AND logic)
    return matchesPersona && matchesIndustry && matchesCountry;
  });

  // Calculate percentages for filtered data
  const strategicPriorities = {
    "Growth & Market Expansion": calculatePercentages(
      filteredResponses,
      "q2_growth"
    ),
    Innovation: calculatePercentages(filteredResponses, "q2_innovation"),
    Transformation: calculatePercentages(
      filteredResponses,
      "q2_transformation"
    ),
    "AI & Technology": calculatePercentages(
      filteredResponses,
      "q2_ai_technology"
    ),
    "Cost Efficiency": calculatePercentages(
      filteredResponses,
      "q2_cost_efficiency"
    ),
    "Skills for Future": calculatePercentages(
      filteredResponses,
      "q2_skills_future"
    ),
    "Culture Change": calculatePercentages(
      filteredResponses,
      "q2_culture_change"
    ),
    "Risk Management": calculatePercentages(
      filteredResponses,
      "q2_risk_reputation"
    ),
    "Sustainability & ESG": calculatePercentages(
      filteredResponses,
      "q2_sustainability_esg"
    ),
  };

  const externalTrends = {
    "Economic Uncertainty": calculatePercentages(
      filteredResponses,
      "q3_economic_uncertainty"
    ),
    "Political Uncertainty": calculatePercentages(
      filteredResponses,
      "q3_political_uncertainty"
    ),
    "Sustainability Transition": calculatePercentages(
      filteredResponses,
      "q3_sustainability_transition"
    ),
    "Regulatory Changes": calculatePercentages(
      filteredResponses,
      "q3_regulatory_changes"
    ),
    "Supply Chain Issues": calculatePercentages(
      filteredResponses,
      "q3_supply_chain"
    ),
    "Labor Shortages": calculatePercentages(
      filteredResponses,
      "q3_labor_skills_shortage"
    ),
    "Technology Changes": calculatePercentages(
      filteredResponses,
      "q3_technological_changes"
    ),
    "Industry Convergence": calculatePercentages(
      filteredResponses,
      "q3_industry_convergence"
    ),
    "Consumer Behavior": calculatePercentages(
      filteredResponses,
      "q3_consumer_behaviors"
    ),
    "Activist Behaviors": calculatePercentages(
      filteredResponses,
      "q3_activist_behaviors"
    ),
    "M&A Activity": calculatePercentages(
      filteredResponses,
      "q3_ma_restructuring"
    ),
    "Competitive Innovation": calculatePercentages(
      filteredResponses,
      "q3_competitive_innovation"
    ),
  };

  const organizationalProblems = {
    "Lack of Productivity": calculatePercentages(
      filteredResponses,
      "q4_lack_productivity"
    ),
    "Lack of Engagement": calculatePercentages(
      filteredResponses,
      "q4_lack_engagement"
    ),
    "Return to Office Resistance": calculatePercentages(
      filteredResponses,
      "q4_return_office_resistance"
    ),
    "Flexibility Requests": calculatePercentages(
      filteredResponses,
      "q4_flexibility_requests"
    ),
    "Goal Alignment Issues": calculatePercentages(
      filteredResponses,
      "q4_alignment_goals"
    ),
    "AI Resistance": calculatePercentages(
      filteredResponses,
      "q4_ai_resistance"
    ),
    "Generational Challenges": calculatePercentages(
      filteredResponses,
      "q4_generational_challenges"
    ),
    "Change Fatigue": calculatePercentages(
      filteredResponses,
      "q4_change_fatigue"
    ),
  };

  return {
    responses: filteredResponses,
    sampleSize: filteredResponses.length,
    strategicPriorities,
    externalTrends,
    organizationalProblems,
  };
};

// Main Dashboard Component
const StrategicPrioritiesDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("strategic");
  const [selectedPersona, setSelectedPersona] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/csv-data");
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        const responses = parseCSV(csvText);
        const processedData = processData(responses);
        setData(processedData);
        console.log("✅ Successfully loaded real survey data:", processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
        console.error("❌ Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#138D64" }}
          ></div>
          <p className="text-gray-600">Loading survey data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4" style={{ color: "#177D52" }}>
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-white px-4 py-2 rounded hover:opacity-90"
            style={{ backgroundColor: "#138D64" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>No data available</div>;
  }

  // Get filtered results
  const filteredResults = applyFilters(
    data,
    selectedPersona,
    selectedIndustry,
    selectedCountry
  );

  // Convert data to chart format with consistent ordering
  const formatChartData = (
    dataObj: { [key: string]: number },
    referenceOrder: string[]
  ) => {
    // Create entries for all items in reference order
    return referenceOrder.map((name) => ({
      name,
      value: dataObj[name] || 0,
    }));
  };

  // Establish reference order based on overall data (highest to lowest when all filters are "All")
  const getBaselineOrder = (dataObj: { [key: string]: number }) => {
    return Object.entries(dataObj)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  };

  // Get baseline orders for consistent x-axis
  const strategicPrioritiesOrder = getBaselineOrder(data.strategicPriorities);
  const externalTrendsOrder = getBaselineOrder(data.externalTrends);
  const organizationalProblemsOrder = getBaselineOrder(
    data.organizationalProblems
  );

  const strategicPrioritiesChart = formatChartData(
    filteredResults.strategicPriorities,
    strategicPrioritiesOrder
  );
  const externalTrendsChart = formatChartData(
    filteredResults.externalTrends,
    externalTrendsOrder
  );
  const organizationalProblemsChart = formatChartData(
    filteredResults.organizationalProblems,
    organizationalProblemsOrder
  );

  // Create sorted data for Marketing Insights (top items by current filter values)
  const strategicPrioritiesInsights = Object.entries(
    filteredResults.strategicPriorities
  )
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const externalTrendsInsights = Object.entries(filteredResults.externalTrends)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const organizationalProblemsInsights = Object.entries(
    filteredResults.organizationalProblems
  )
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const COLORS = [
    "#138D64",
    "#177D52",
    "#0E4230",
    "#82ca9d",
    "#66bb6a",
    "#4caf50",
    "#2e7d32",
    "#1b5e20",
  ];

  // Create dynamic title for Marketing Insights
  const getMarketingInsightsTitle = () => {
    const role = selectedPersona !== "All" ? selectedPersona : "Senior Leaders";
    const industry =
      selectedIndustry !== "All" ? ` in ${selectedIndustry}` : "";
    const country = selectedCountry !== "All" ? ` in ${selectedCountry}` : "";
    return `Marketing Insights: How to Engage ${role}${industry}${country}`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Korn Ferry Senior Leader Survey Dashboard
        </h1>
        <p className="text-gray-600">
          Analysis of <strong>{data.totalResponses}</strong> senior leader
          survey responses from the Korn Ferry dataset
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Data Source: Korn Ferry Senior Leader Survey April 2025
        </p>
        <p className="text-sm text-blue-600 mt-1">
          <strong>For Marketers:</strong> Understand what senior leaders
          prioritize, their challenges, and how to communicate effectively with
          them
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#0E4230" }}>
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persona/Role
            </label>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Personas</option>
              {data.availablePersonas.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Industries</option>
              {data.availableIndustries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Countries</option>
              {data.availableCountries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sample Size Display */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-blue-900">
                Current Sample Size:{" "}
                <strong>{filteredResults.sampleSize}</strong> responses
              </span>
              <span className="text-xs text-blue-700 ml-2">
                (
                {Math.round(
                  (filteredResults.sampleSize / data.totalResponses) * 100
                )}
                % of total dataset)
              </span>
            </div>
            {filteredResults.sampleSize < 10 && (
              <div className="text-xs text-orange-600 font-medium">
                ⚠️ Small sample size - results may not be statistically
                significant
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: "strategic", label: "Strategic Priorities" },
            { id: "trends", label: "External Trends" },
            { id: "problems", label: "Organizational Problems" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={{
                ...(activeTab === tab.id ? { borderColor: "#177D52" } : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {activeTab === "strategic" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Strategic Priorities - Top Responses
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={strategicPrioritiesChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Response Rate"]}
                  />
                  <Bar dataKey="value" fill="#138D64" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Strategic Priorities Distribution
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={strategicPrioritiesChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#138D64"
                    dataKey="value"
                  >
                    {strategicPrioritiesChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Response Rate"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === "trends" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                External Trends - Impact Assessment
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={externalTrendsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Impact Rate"]}
                  />
                  <Bar dataKey="value" fill="#177D52" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                External Trends Distribution
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={externalTrendsChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#177D52"
                    dataKey="value"
                  >
                    {externalTrendsChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Impact Rate"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === "problems" && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Organizational Problems - Frequency
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={organizationalProblemsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Problem Rate"]}
                  />
                  <Bar dataKey="value" fill="#0E4230" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Organizational Problems Distribution
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={organizationalProblemsChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#0E4230"
                    dataKey="value"
                  >
                    {organizationalProblemsChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Problem Rate"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#0E4230" }}>
          Current Filter Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#138D64" }}>
              {filteredResults.sampleSize}
            </div>
            <div className="text-gray-600">Sample Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#138D64" }}>
              {selectedPersona !== "All" ? selectedPersona : "All Personas"}
            </div>
            <div className="text-gray-600">Selected Role</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#177D52" }}>
              {selectedIndustry !== "All" ? selectedIndustry : "All Industries"}
            </div>
            <div className="text-gray-600">Selected Industry</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "#0E4230" }}>
              {selectedCountry !== "All" ? selectedCountry : "All Countries"}
            </div>
            <div className="text-gray-600">Selected Country</div>
          </div>
        </div>
      </div>

      {/* Marketing Insights Section */}
      <div
        className="mt-6 p-6 rounded-lg border-l-4"
        style={{
          backgroundColor: "rgba(194, 217, 210, 0.5)",
          borderColor: "#0E4230",
        }}
      >
        <h3
          className="text-xl font-bold text-gray-900 mb-4 flex items-center"
          style={{ color: "#0E4230" }}
        >
          {getMarketingInsightsTitle()}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === "strategic" && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3" style={{ color: "#138D64" }}>
                  Top Priorities to Address
                </h4>
                <ul className="space-y-2 text-sm">
                  {strategicPrioritiesInsights
                    .slice(0, 3)
                    .map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: "#138D64" }}
                        ></span>
                        <strong>{item.name}</strong> ({item.value}% of leaders
                        prioritize this)
                      </li>
                    ))}
                </ul>
                <p className="text-xs text-gray-600 mt-3">
                  <strong>Marketing Tip:</strong> Lead with solutions that
                  address these top priorities in your messaging.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3" style={{ color: "#138D64" }}>
                  Communication Strategy
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#138D64" }}
                    ></span>
                    <div>
                      <strong>Be Data-Driven:</strong> These leaders make
                      decisions based on metrics and ROI
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#138D64" }}
                    ></span>
                    <div>
                      <strong>Focus on Outcomes:</strong> Show how you solve
                      their top 3 priorities
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#138D64" }}
                    ></span>
                    <div>
                      <strong>Address Pain Points:</strong> Acknowledge their
                      specific organizational challenges
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "trends" && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3" style={{ color: "#177D52" }}>
                  Top External Pressures
                </h4>
                <ul className="space-y-2 text-sm">
                  {externalTrendsInsights.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: "#177D52" }}
                      ></span>
                      <strong>{item.name}</strong> ({item.value}% see this as
                      impactful)
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-600 mt-3">
                  <strong>Marketing Tip:</strong> Reference these trends to show
                  you understand their business environment.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3" style={{ color: "#177D52" }}>
                  Trend-Based Messaging
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#177D52" }}
                    ></span>
                    <div>
                      <strong>Show Awareness:</strong> Demonstrate understanding
                      of their external challenges
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#177D52" }}
                    ></span>
                    <div>
                      <strong>Offer Solutions:</strong> Position your services
                      as responses to these trends
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#177D52" }}
                    ></span>
                    <div>
                      <strong>Be Timely:</strong> Reference current market
                      conditions in your outreach
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "problems" && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3" style={{ color: "#0E4230" }}>
                  Biggest Pain Points
                </h4>
                <ul className="space-y-2 text-sm">
                  {organizationalProblemsInsights
                    .slice(0, 3)
                    .map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: "#0E4230" }}
                        ></span>
                        <strong>{item.name}</strong> ({item.value}% experiencing
                        this)
                      </li>
                    ))}
                </ul>
                <p className="text-xs text-gray-600 mt-3">
                  <strong>Marketing Tip:</strong> Position your solutions as
                  addressing these specific pain points.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold mb-3" style={{ color: "#0E4230" }}>
                  Problem-Solving Approach
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#0E4230" }}
                    ></span>
                    <div>
                      <strong>Acknowledge Issues:</strong> Show you understand
                      their specific challenges
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#0E4230" }}
                    ></span>
                    <div>
                      <strong>Provide Evidence:</strong> Share case studies of
                      similar problem resolution
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className="w-2 h-2 rounded-full mr-2 mt-1.5"
                      style={{ backgroundColor: "#0E4230" }}
                    ></span>
                    <div>
                      <strong>Offer Quick Wins:</strong> Suggest immediate
                      improvements alongside long-term solutions
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className="mt-4 p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(23, 125, 82, 0.1)",
            border: "1px solid #177D52",
          }}
        >
          <p className="text-sm" style={{ color: "#0E4230" }}>
            <strong>Pro Tip:</strong> Use the filters above to segment by role,
            industry, or country to create highly targeted messaging for
            specific senior leader personas. Sample size:{" "}
            {filteredResults.sampleSize} responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategicPrioritiesDashboard;

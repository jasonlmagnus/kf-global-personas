"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types for the actual CSV data
interface SurveyResponse {
  // Demographics
  companySize: string;
  country: string;
  industry: string;
  jobTitle: string;
  jobFunction: string;
  decisionMaking: string;
  boardStatus: string;

  // Strategic Priorities (Q2) - binary 0/1 responses
  q2_growth: number;
  q2_innovation: number;
  q2_transformation: number;
  q2_ai_technology: number;
  q2_cost_efficiency: number;
  q2_skills_future: number;
  q2_culture_change: number;
  q2_risk_reputation: number;
  q2_sustainability_esg: number;

  // External Trends (Q3) - binary 0/1 responses
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

  // Organizational Problems (Q4) - binary 0/1 responses
  q4_lack_productivity: number;
  q4_lack_engagement: number;
  q4_return_office_resistance: number;
  q4_flexibility_requests: number;
  q4_alignment_goals: number;
  q4_ai_resistance: number;
  q4_generational_challenges: number;
  q4_change_fatigue: number;

  // Open-ended responses
  challenges?: string;
  capability_gaps?: string;
  consulting_preferences?: string;
}

interface DashboardData {
  totalResponses: number;
  strategicPriorities: { [key: string]: number };
  externalTrends: { [key: string]: number };
  organizationalProblems: { [key: string]: number };
  byPersona: {
    [personaRole: string]: {
      strategicPriorities: { [key: string]: number };
      externalTrends: { [key: string]: number };
      organizationalProblems: { [key: string]: number };
    };
  };
  byIndustry: {
    [industry: string]: {
      strategicPriorities: { [key: string]: number };
      externalTrends: { [key: string]: number };
      organizationalProblems: { [key: string]: number };
    };
  };
  byCountry: {
    [country: string]: {
      strategicPriorities: { [key: string]: number };
      externalTrends: { [key: string]: number };
      organizationalProblems: { [key: string]: number };
    };
  };
}

// CSV parsing function
const parseCSV = (csvText: string): SurveyResponse[] => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  const responses: SurveyResponse[] = [];

  for (let i = 2; i < lines.length; i++) {
    // Skip header and description row
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV line handling quoted values
    const values: string[] = [];
    let currentValue = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Add the last value

    if (values.length < headers.length) continue;

    // Map CSV columns to our data structure
    const response: SurveyResponse = {
      companySize:
        values[headers.indexOf("S1 - Tell us your company size.")] || "",
      country:
        values[
          headers.indexOf(
            "S2 - In which of the following countries are you currently based for work?"
          )
        ] || "",
      industry:
        values[
          headers.indexOf(
            "S3 - Which of the following industries do you work in?"
          )
        ] || "",
      jobTitle:
        values[
          headers.indexOf(
            "S4 - Which of these best describes your job title at the company?"
          )
        ] || "",
      jobFunction:
        values[
          headers.indexOf(
            "S5 - Which of these best describes your job function?"
          )
        ] || "",
      decisionMaking:
        values[
          headers.indexOf(
            "S6 - To what extent are you involved in the decision-making process of your line of business?"
          )
        ] || "",
      boardStatus:
        values[headers.indexOf("S7 - Are you on the board of a company?")] ||
        "",

      // Strategic Priorities (Q2)
      q2_growth: parseInt(
        values[headers.indexOf("Q2 - Growth & market expansion")] || "0"
      ),
      q2_innovation: parseInt(
        values[headers.indexOf("Q2 - Innovation")] || "0"
      ),
      q2_transformation: parseInt(
        values[headers.indexOf("Q2 - Transformation")] || "0"
      ),
      q2_ai_technology: parseInt(
        values[headers.indexOf("Q2 - AI & technology")] || "0"
      ),
      q2_cost_efficiency: parseInt(
        values[headers.indexOf("Q2 - Cost efficiency & productivity")] || "0"
      ),
      q2_skills_future: parseInt(
        values[headers.indexOf("Q2 - Skills for the future")] || "0"
      ),
      q2_culture_change: parseInt(
        values[headers.indexOf("Q2 - Culture change")] || "0"
      ),
      q2_risk_reputation: parseInt(
        values[headers.indexOf("Q2 - Risk & reputation management")] || "0"
      ),
      q2_sustainability_esg: parseInt(
        values[headers.indexOf("Q2 - Sustainability & ESG")] || "0"
      ),

      // External Trends (Q3)
      q3_economic_uncertainty: parseInt(
        values[headers.indexOf("Q3 - Economic uncertainty")] || "0"
      ),
      q3_political_uncertainty: parseInt(
        values[headers.indexOf("Q3 - Political uncertainty")] || "0"
      ),
      q3_sustainability_transition: parseInt(
        values[
          headers.indexOf("Q3 - Sustainability and the energy transition")
        ] || "0"
      ),
      q3_regulatory_changes: parseInt(
        values[headers.indexOf("Q3 - Regulatory changes")] || "0"
      ),
      q3_supply_chain: parseInt(
        values[headers.indexOf("Q3 - Supply chain shortage")] || "0"
      ),
      q3_labor_skills_shortage: parseInt(
        values[headers.indexOf("Q3 - Labor and skills shortages")] || "0"
      ),
      q3_technological_changes: parseInt(
        values[
          headers.indexOf("Q3 - Technological changes, including generative AI")
        ] || "0"
      ),
      q3_industry_convergence: parseInt(
        values[headers.indexOf("Q3 - Convergence of industries")] || "0"
      ),
      q3_consumer_behaviors: parseInt(
        values[headers.indexOf("Q3 - Changing consumer behaviors")] || "0"
      ),
      q3_activist_behaviors: parseInt(
        values[headers.indexOf("Q3 - Activist behaviors")] || "0"
      ),
      q3_ma_restructuring: parseInt(
        values[headers.indexOf("Q3 - M&A (consolidation and restructuring)")] ||
          "0"
      ),
      q3_competitive_innovation: parseInt(
        values[headers.indexOf("Q3 - Competitive innovation")] || "0"
      ),

      // Organizational Problems (Q4)
      q4_lack_productivity: parseInt(
        values[headers.indexOf("Q4 - Lack of productivity")] || "0"
      ),
      q4_lack_engagement: parseInt(
        values[headers.indexOf("Q4 - Lack of engagement")] || "0"
      ),
      q4_return_office_resistance: parseInt(
        values[headers.indexOf("Q4 - Resistance to return to office")] || "0"
      ),
      q4_flexibility_requests: parseInt(
        values[headers.indexOf("Q4 - Requests for more flexibility")] || "0"
      ),
      q4_alignment_goals: parseInt(
        values[
          headers.indexOf("Q4 - Lack of alignment with organizational goals")
        ] || "0"
      ),
      q4_ai_resistance: parseInt(
        values[headers.indexOf("Q4 - Resistance to AI and new technologies")] ||
          "0"
      ),
      q4_generational_challenges: parseInt(
        values[headers.indexOf("Q4 - Inter-generational challenges")] || "0"
      ),
      q4_change_fatigue: parseInt(
        values[headers.indexOf("Q4 - Change fatigue")] || "0"
      ),

      // Open-ended responses
      challenges:
        values[
          headers.indexOf(
            "Q5 - Where are you feeling the most pressure to perform and where do you feel stuck?"
          )
        ] || "",
      capability_gaps:
        values[
          headers.indexOf(
            "Q6 - Are there any critical capability gaps you're working to close either at a team or organizational level?"
          )
        ] || "",
    };

    responses.push(response);
  }

  return responses;
};

// Calculate percentages from binary responses
const calculatePercentages = (
  responses: SurveyResponse[],
  field: keyof SurveyResponse
): number => {
  if (responses.length === 0) return 0;
  const sum = responses.reduce(
    (acc, response) => acc + ((response[field] as number) || 0),
    0
  );
  return Math.round((sum / responses.length) * 100);
};

// Process data into dashboard format
const processData = (responses: SurveyResponse[]): DashboardData => {
  const totalResponses = responses.length;

  // Overall percentages
  const strategicPriorities = {
    "Growth & Market Expansion": calculatePercentages(responses, "q2_growth"),
    Innovation: calculatePercentages(responses, "q2_innovation"),
    Transformation: calculatePercentages(responses, "q2_transformation"),
    "AI & Technology": calculatePercentages(responses, "q2_ai_technology"),
    "Cost Efficiency": calculatePercentages(responses, "q2_cost_efficiency"),
    "Skills for Future": calculatePercentages(responses, "q2_skills_future"),
    "Culture Change": calculatePercentages(responses, "q2_culture_change"),
    "Risk Management": calculatePercentages(responses, "q2_risk_reputation"),
    "Sustainability & ESG": calculatePercentages(
      responses,
      "q2_sustainability_esg"
    ),
  };

  const externalTrends = {
    "Economic Uncertainty": calculatePercentages(
      responses,
      "q3_economic_uncertainty"
    ),
    "Political Uncertainty": calculatePercentages(
      responses,
      "q3_political_uncertainty"
    ),
    "Sustainability Transition": calculatePercentages(
      responses,
      "q3_sustainability_transition"
    ),
    "Regulatory Changes": calculatePercentages(
      responses,
      "q3_regulatory_changes"
    ),
    "Supply Chain Issues": calculatePercentages(responses, "q3_supply_chain"),
    "Labor/Skills Shortages": calculatePercentages(
      responses,
      "q3_labor_skills_shortage"
    ),
    "Tech Changes/AI": calculatePercentages(
      responses,
      "q3_technological_changes"
    ),
    "Industry Convergence": calculatePercentages(
      responses,
      "q3_industry_convergence"
    ),
    "Consumer Behavior": calculatePercentages(
      responses,
      "q3_consumer_behaviors"
    ),
    "Activist Behaviors": calculatePercentages(
      responses,
      "q3_activist_behaviors"
    ),
    "M&A/Restructuring": calculatePercentages(responses, "q3_ma_restructuring"),
    "Competitive Innovation": calculatePercentages(
      responses,
      "q3_competitive_innovation"
    ),
  };

  const organizationalProblems = {
    "Lack of Productivity": calculatePercentages(
      responses,
      "q4_lack_productivity"
    ),
    "Lack of Engagement": calculatePercentages(responses, "q4_lack_engagement"),
    "Return to Office Resistance": calculatePercentages(
      responses,
      "q4_return_office_resistance"
    ),
    "Flexibility Requests": calculatePercentages(
      responses,
      "q4_flexibility_requests"
    ),
    "Goal Misalignment": calculatePercentages(responses, "q4_alignment_goals"),
    "AI Resistance": calculatePercentages(responses, "q4_ai_resistance"),
    "Generational Challenges": calculatePercentages(
      responses,
      "q4_generational_challenges"
    ),
    "Change Fatigue": calculatePercentages(responses, "q4_change_fatigue"),
  };

  // Group by persona (job title)
  const byPersona: DashboardData["byPersona"] = {};
  const personaGroups = responses.reduce((acc, response) => {
    const persona = response.jobTitle || "Unknown";
    if (!acc[persona]) acc[persona] = [];
    acc[persona].push(response);
    return acc;
  }, {} as Record<string, SurveyResponse[]>);

  Object.entries(personaGroups).forEach(([persona, personaResponses]) => {
    byPersona[persona] = {
      strategicPriorities: {
        "Growth & Market Expansion": calculatePercentages(
          personaResponses,
          "q2_growth"
        ),
        Innovation: calculatePercentages(personaResponses, "q2_innovation"),
        Transformation: calculatePercentages(
          personaResponses,
          "q2_transformation"
        ),
        "AI & Technology": calculatePercentages(
          personaResponses,
          "q2_ai_technology"
        ),
        "Cost Efficiency": calculatePercentages(
          personaResponses,
          "q2_cost_efficiency"
        ),
        "Skills for Future": calculatePercentages(
          personaResponses,
          "q2_skills_future"
        ),
        "Culture Change": calculatePercentages(
          personaResponses,
          "q2_culture_change"
        ),
        "Risk Management": calculatePercentages(
          personaResponses,
          "q2_risk_reputation"
        ),
        "Sustainability & ESG": calculatePercentages(
          personaResponses,
          "q2_sustainability_esg"
        ),
      },
      externalTrends: {
        "Economic Uncertainty": calculatePercentages(
          personaResponses,
          "q3_economic_uncertainty"
        ),
        "Political Uncertainty": calculatePercentages(
          personaResponses,
          "q3_political_uncertainty"
        ),
        "Sustainability Transition": calculatePercentages(
          personaResponses,
          "q3_sustainability_transition"
        ),
        "Regulatory Changes": calculatePercentages(
          personaResponses,
          "q3_regulatory_changes"
        ),
        "Supply Chain Issues": calculatePercentages(
          personaResponses,
          "q3_supply_chain"
        ),
        "Labor/Skills Shortages": calculatePercentages(
          personaResponses,
          "q3_labor_skills_shortage"
        ),
        "Tech Changes/AI": calculatePercentages(
          personaResponses,
          "q3_technological_changes"
        ),
        "Industry Convergence": calculatePercentages(
          personaResponses,
          "q3_industry_convergence"
        ),
        "Consumer Behavior": calculatePercentages(
          personaResponses,
          "q3_consumer_behaviors"
        ),
        "Activist Behaviors": calculatePercentages(
          personaResponses,
          "q3_activist_behaviors"
        ),
        "M&A/Restructuring": calculatePercentages(
          personaResponses,
          "q3_ma_restructuring"
        ),
        "Competitive Innovation": calculatePercentages(
          personaResponses,
          "q3_competitive_innovation"
        ),
      },
      organizationalProblems: {
        "Lack of Productivity": calculatePercentages(
          personaResponses,
          "q4_lack_productivity"
        ),
        "Lack of Engagement": calculatePercentages(
          personaResponses,
          "q4_lack_engagement"
        ),
        "Return to Office Resistance": calculatePercentages(
          personaResponses,
          "q4_return_office_resistance"
        ),
        "Flexibility Requests": calculatePercentages(
          personaResponses,
          "q4_flexibility_requests"
        ),
        "Goal Misalignment": calculatePercentages(
          personaResponses,
          "q4_alignment_goals"
        ),
        "AI Resistance": calculatePercentages(
          personaResponses,
          "q4_ai_resistance"
        ),
        "Generational Challenges": calculatePercentages(
          personaResponses,
          "q4_generational_challenges"
        ),
        "Change Fatigue": calculatePercentages(
          personaResponses,
          "q4_change_fatigue"
        ),
      },
    };
  });

  // Group by industry
  const byIndustry: DashboardData["byIndustry"] = {};
  const industryGroups = responses.reduce((acc, response) => {
    const industry = response.industry || "Unknown";
    if (!acc[industry]) acc[industry] = [];
    acc[industry].push(response);
    return acc;
  }, {} as Record<string, SurveyResponse[]>);

  Object.entries(industryGroups).forEach(([industry, industryResponses]) => {
    byIndustry[industry] = {
      strategicPriorities: {
        "Growth & Market Expansion": calculatePercentages(
          industryResponses,
          "q2_growth"
        ),
        Innovation: calculatePercentages(industryResponses, "q2_innovation"),
        Transformation: calculatePercentages(
          industryResponses,
          "q2_transformation"
        ),
        "AI & Technology": calculatePercentages(
          industryResponses,
          "q2_ai_technology"
        ),
        "Cost Efficiency": calculatePercentages(
          industryResponses,
          "q2_cost_efficiency"
        ),
        "Skills for Future": calculatePercentages(
          industryResponses,
          "q2_skills_future"
        ),
        "Culture Change": calculatePercentages(
          industryResponses,
          "q2_culture_change"
        ),
        "Risk Management": calculatePercentages(
          industryResponses,
          "q2_risk_reputation"
        ),
        "Sustainability & ESG": calculatePercentages(
          industryResponses,
          "q2_sustainability_esg"
        ),
      },
      externalTrends: {
        "Economic Uncertainty": calculatePercentages(
          industryResponses,
          "q3_economic_uncertainty"
        ),
        "Political Uncertainty": calculatePercentages(
          industryResponses,
          "q3_political_uncertainty"
        ),
        "Sustainability Transition": calculatePercentages(
          industryResponses,
          "q3_sustainability_transition"
        ),
        "Regulatory Changes": calculatePercentages(
          industryResponses,
          "q3_regulatory_changes"
        ),
        "Supply Chain Issues": calculatePercentages(
          industryResponses,
          "q3_supply_chain"
        ),
        "Labor/Skills Shortages": calculatePercentages(
          industryResponses,
          "q3_labor_skills_shortage"
        ),
        "Tech Changes/AI": calculatePercentages(
          industryResponses,
          "q3_technological_changes"
        ),
        "Industry Convergence": calculatePercentages(
          industryResponses,
          "q3_industry_convergence"
        ),
        "Consumer Behavior": calculatePercentages(
          industryResponses,
          "q3_consumer_behaviors"
        ),
        "Activist Behaviors": calculatePercentages(
          industryResponses,
          "q3_activist_behaviors"
        ),
        "M&A/Restructuring": calculatePercentages(
          industryResponses,
          "q3_ma_restructuring"
        ),
        "Competitive Innovation": calculatePercentages(
          industryResponses,
          "q3_competitive_innovation"
        ),
      },
      organizationalProblems: {
        "Lack of Productivity": calculatePercentages(
          industryResponses,
          "q4_lack_productivity"
        ),
        "Lack of Engagement": calculatePercentages(
          industryResponses,
          "q4_lack_engagement"
        ),
        "Return to Office Resistance": calculatePercentages(
          industryResponses,
          "q4_return_office_resistance"
        ),
        "Flexibility Requests": calculatePercentages(
          industryResponses,
          "q4_flexibility_requests"
        ),
        "Goal Misalignment": calculatePercentages(
          industryResponses,
          "q4_alignment_goals"
        ),
        "AI Resistance": calculatePercentages(
          industryResponses,
          "q4_ai_resistance"
        ),
        "Generational Challenges": calculatePercentages(
          industryResponses,
          "q4_generational_challenges"
        ),
        "Change Fatigue": calculatePercentages(
          industryResponses,
          "q4_change_fatigue"
        ),
      },
    };
  });

  // Group by country
  const byCountry: DashboardData["byCountry"] = {};
  const countryGroups = responses.reduce((acc, response) => {
    const country = response.country || "Unknown";
    if (!acc[country]) acc[country] = [];
    acc[country].push(response);
    return acc;
  }, {} as Record<string, SurveyResponse[]>);

  Object.entries(countryGroups).forEach(([country, countryResponses]) => {
    byCountry[country] = {
      strategicPriorities: {
        "Growth & Market Expansion": calculatePercentages(
          countryResponses,
          "q2_growth"
        ),
        Innovation: calculatePercentages(countryResponses, "q2_innovation"),
        Transformation: calculatePercentages(
          countryResponses,
          "q2_transformation"
        ),
        "AI & Technology": calculatePercentages(
          countryResponses,
          "q2_ai_technology"
        ),
        "Cost Efficiency": calculatePercentages(
          countryResponses,
          "q2_cost_efficiency"
        ),
        "Skills for Future": calculatePercentages(
          countryResponses,
          "q2_skills_future"
        ),
        "Culture Change": calculatePercentages(
          countryResponses,
          "q2_culture_change"
        ),
        "Risk Management": calculatePercentages(
          countryResponses,
          "q2_risk_reputation"
        ),
        "Sustainability & ESG": calculatePercentages(
          countryResponses,
          "q2_sustainability_esg"
        ),
      },
      externalTrends: {
        "Economic Uncertainty": calculatePercentages(
          countryResponses,
          "q3_economic_uncertainty"
        ),
        "Political Uncertainty": calculatePercentages(
          countryResponses,
          "q3_political_uncertainty"
        ),
        "Sustainability Transition": calculatePercentages(
          countryResponses,
          "q3_sustainability_transition"
        ),
        "Regulatory Changes": calculatePercentages(
          countryResponses,
          "q3_regulatory_changes"
        ),
        "Supply Chain Issues": calculatePercentages(
          countryResponses,
          "q3_supply_chain"
        ),
        "Labor/Skills Shortages": calculatePercentages(
          countryResponses,
          "q3_labor_skills_shortage"
        ),
        "Tech Changes/AI": calculatePercentages(
          countryResponses,
          "q3_technological_changes"
        ),
        "Industry Convergence": calculatePercentages(
          countryResponses,
          "q3_industry_convergence"
        ),
        "Consumer Behavior": calculatePercentages(
          countryResponses,
          "q3_consumer_behaviors"
        ),
        "Activist Behaviors": calculatePercentages(
          countryResponses,
          "q3_activist_behaviors"
        ),
        "M&A/Restructuring": calculatePercentages(
          countryResponses,
          "q3_ma_restructuring"
        ),
        "Competitive Innovation": calculatePercentages(
          countryResponses,
          "q3_competitive_innovation"
        ),
      },
      organizationalProblems: {
        "Lack of Productivity": calculatePercentages(
          countryResponses,
          "q4_lack_productivity"
        ),
        "Lack of Engagement": calculatePercentages(
          countryResponses,
          "q4_lack_engagement"
        ),
        "Return to Office Resistance": calculatePercentages(
          countryResponses,
          "q4_return_office_resistance"
        ),
        "Flexibility Requests": calculatePercentages(
          countryResponses,
          "q4_flexibility_requests"
        ),
        "Goal Misalignment": calculatePercentages(
          countryResponses,
          "q4_alignment_goals"
        ),
        "AI Resistance": calculatePercentages(
          countryResponses,
          "q4_ai_resistance"
        ),
        "Generational Challenges": calculatePercentages(
          countryResponses,
          "q4_generational_challenges"
        ),
        "Change Fatigue": calculatePercentages(
          countryResponses,
          "q4_change_fatigue"
        ),
      },
    };
  });

  return {
    totalResponses,
    strategicPriorities,
    externalTrends,
    organizationalProblems,
    byPersona,
    byIndustry,
    byCountry,
  };
};

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
        const response = await fetch(
          "/data/__src/Korn Ferry open ends Senior Leader Survey April 2025(Textual Data).csv"
        );
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real survey data from CSV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
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
            Error Loading Real Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Attempting to load: /data/__src/Korn Ferry open ends Senior Leader
            Survey April 2025(Textual Data).csv
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

  // Get available filter options
  const personaOptions = ["All", ...Object.keys(data.byPersona)];
  const industryOptions = ["All", ...Object.keys(data.byIndustry)];
  const countryOptions = ["All", ...Object.keys(data.byCountry)];

  // Get filtered data based on selections
  const getFilteredData = () => {
    if (
      selectedPersona === "All" &&
      selectedIndustry === "All" &&
      selectedCountry === "All"
    ) {
      return {
        strategicPriorities: data.strategicPriorities,
        externalTrends: data.externalTrends,
        organizationalProblems: data.organizationalProblems,
      };
    }

    // For now, show persona-specific data if persona is selected
    if (selectedPersona !== "All" && data.byPersona[selectedPersona]) {
      return data.byPersona[selectedPersona];
    }

    // Industry-specific data
    if (selectedIndustry !== "All" && data.byIndustry[selectedIndustry]) {
      return data.byIndustry[selectedIndustry];
    }

    // Country-specific data
    if (selectedCountry !== "All" && data.byCountry[selectedCountry]) {
      return data.byCountry[selectedCountry];
    }

    return {
      strategicPriorities: data.strategicPriorities,
      externalTrends: data.externalTrends,
      organizationalProblems: data.organizationalProblems,
    };
  };

  const filteredData = getFilteredData();

  // Convert data to chart format
  const formatChartData = (dataObj: { [key: string]: number }) => {
    return Object.entries(dataObj)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const strategicPrioritiesChart = formatChartData(
    filteredData.strategicPriorities
  );
  const externalTrendsChart = formatChartData(filteredData.externalTrends);
  const organizationalProblemsChart = formatChartData(
    filteredData.organizationalProblems
  );

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎯 Korn Ferry Senior Leader Survey Dashboard
        </h1>
        <p className="text-gray-600">
          📊 Real data analysis of <strong>{data.totalResponses}</strong> global
          senior leader survey responses
        </p>
        <p className="text-sm text-green-600 mt-1">
          ✅ Data loaded from actual CSV file - no more mock data!
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">🔍 Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persona/Role
            </label>
            <select
              value={selectedPersona}
              onChange={(e) => setSelectedPersona(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {personaOptions.map((option) => (
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
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {industryOptions.map((option) => (
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
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {countryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: "strategic", label: "🎯 Strategic Priorities" },
            { id: "trends", label: "📈 External Trends" },
            { id: "problems", label: "⚠️ Organizational Problems" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
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
                Strategic Priorities (% of responses)
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
                  <Bar dataKey="value" fill="#8884d8" />
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
                    data={strategicPrioritiesChart.filter(
                      (item) => item.value > 0
                    )}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
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
                External Trends Impact (% of responses)
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
                    formatter={(value) => [`${value}%`, "Response Rate"]}
                  />
                  <Bar dataKey="value" fill="#82ca9d" />
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
                    data={externalTrendsChart.filter((item) => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#82ca9d"
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
                    formatter={(value) => [`${value}%`, "Response Rate"]}
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
                Organizational Problems (% of responses)
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
                    formatter={(value) => [`${value}%`, "Response Rate"]}
                  />
                  <Bar dataKey="value" fill="#ffc658" />
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
                    data={organizationalProblemsChart.filter(
                      (item) => item.value > 0
                    )}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#ffc658"
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
                    formatter={(value) => [`${value}%`, "Response Rate"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          📋 Current Filter Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {selectedPersona !== "All" ? selectedPersona : "All Personas"}
            </div>
            <div className="text-gray-600">Selected Role</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {selectedIndustry !== "All" ? selectedIndustry : "All Industries"}
            </div>
            <div className="text-gray-600">Selected Industry</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {selectedCountry !== "All" ? selectedCountry : "All Countries"}
            </div>
            <div className="text-gray-600">Selected Country</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicPrioritiesDashboard;

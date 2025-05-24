"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * CHROSurveyDashboard - Visualization of Senior Executive survey responses as a proxy for
 * CHRO/HR leadership perspectives, compared to CEO and overall workforce
 *
 * Data source: data/__src/2025_global_data.csv
 * IMPORTANT: Uses Senior_Executive data as proxy for CHRO perspective
 *
 * Features:
 * - Shows deviation from overall workforce (not raw percentages)
 * - Displays percentage differences when comparing with CEO responses
 * - Segmentation by region, organization size, demographics, etc.
 * - Focus on talent/people management related insights
 */

// Interface for the data items in the charts
interface ChartDataItem {
  name: string;
  chroPercentage: number;
  ceoPercentage: number;
  meanOtherJobLevelsPercentage: number; // Changed from overallPercentage
  chroDeviation: number; // Difference from meanOtherJobLevelsPercentage
  ceoDeviation: number; // Difference from meanOtherJobLevelsPercentage
  chroToCeoDeviation?: number; // Difference between CHRO and CEO
  // Optional fields for demographics
  segment?: string;
}

// Define types for structured narrative content
interface ParagraphNarrativeItem {
  type: "paragraph";
  content: string;
  isBold?: boolean;
  isItalic?: boolean;
}
interface HeadingNarrativeItem {
  type: "heading";
  content: string;
}
interface InsightActionNarrativeItem {
  type: "insightAction";
  insight: string;
  action: string;
}

export type NarrativeItem =
  | ParagraphNarrativeItem
  | HeadingNarrativeItem
  | InsightActionNarrativeItem;

// Interface for CustomTooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  label?: string | number;
}

// Available segment options from the data
const segmentOptions = {
  region: [
    { id: "all", name: "All Regions" },
    { id: "US", name: "United States" },
    { id: "United_Kingdom", name: "United Kingdom" },
    { id: "India", name: "India" },
    { id: "France", name: "France" },
    { id: "Germany", name: "Germany" },
    { id: "Japan", name: "Japan" },
    { id: "United_Arab_Emirates", name: "UAE" },
    { id: "Brazil", name: "Brazil" },
    { id: "Saudi_Arabia", name: "Saudi Arabia" },
    { id: "Australia", name: "Australia" },
  ],
  orgSize: [
    { id: "all", name: "All Sizes" },
    { id: "<10", name: "< 10 employees" },
    { id: "10-49", name: "10-49 employees" },
    { id: "50-99", name: "50-99 employees" },
    { id: "100-500", name: "100-500 employees" },
    { id: "501-1000", name: "501-1000 employees" },
    { id: "1000+", name: "1000+ employees" },
  ],
  generation: [
    { id: "all", name: "All Generations" },
    { id: "Gen_Z", name: "Gen Z" },
    { id: "Millennials", name: "Millennials" },
    { id: "Gen_X", name: "Gen X" },
    { id: "Baby_Boomers", name: "Baby Boomers" },
  ],
  gender: [
    { id: "all", name: "All Genders" },
    { id: "female", name: "Female" },
    { id: "male", name: "Male" },
  ],
  sector: [
    { id: "all", name: "All Sectors" },
    { id: "Technology", name: "Technology" },
    { id: "Financial_Services", name: "Financial Services" },
    { id: "Healthcare", name: "Healthcare" },
    { id: "Manufacturing_industrial", name: "Manufacturing & Industrial" },
    { id: "Professional_Services", name: "Professional Services" },
    { id: "Education", name: "Education" },
    { id: "Retail", name: "Retail" },
    // Additional sectors omitted for brevity
  ],
};

// Define a type for the raw dashboard data structure
interface QuestionData {
  id: string;
  title: string;
  question: string;
  data: ChartDataItem[];
}

interface SectionData {
  id: string;
  name?: string; // Made optional as it's part of the static sections definition
  title: string;
  narrative: string | NarrativeItem[]; // Narrative can be a string or structured items
  questions: QuestionData[];
}

interface RawDashboardData {
  [key: string]: SectionData;
}

// --- Helper function to parse CSV ---
const parseCSV = (csvText: string): Record<string, string>[] => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map((header) => header.trim());

  const csvData: Record<string, string>[] = [];

  // Regex to handle commas within quoted fields
  // Matches: either a quoted field (allows escaped quotes) or an unquoted field
  const regex = /"((?:[^"\\]|\\.)*)"|([^,]+)/g;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue; // Skip empty lines

    const row: Record<string, string> = {};
    let match;
    let colIndex = 0;
    const values: string[] = [];

    // Reset lastIndex for each line because we are using a global regex
    regex.lastIndex = 0;

    while ((match = regex.exec(line)) !== null && colIndex < headers.length) {
      // match[1] is the content of a quoted field (undefined if not quoted)
      // match[2] is the content of an unquoted field (undefined if quoted)
      const value =
        match[1] !== undefined ? match[1].replace(/\"\"/g, '"') : match[2];
      values.push(value.trim());
      colIndex++;
    }

    // If line parsing resulted in fewer columns than headers due to trailing empty values not caught by regex
    while (values.length < headers.length) {
      values.push("");
    }

    headers.forEach((header, index) => {
      row[header] = values[index] || ""; // Ensure undefined values become empty strings
    });
    csvData.push(row);
  }
  return csvData;
};

// --- Helper function to safely parse percentage string to number ---
const parsePercent = (value?: string): number => {
  if (!value || typeof value !== "string") return 0;
  const num = parseFloat(value.replace("%", ""));
  return isNaN(num) ? 0 : num;
};

const CHROSurveyDashboard = () => {
  const [activeSectionId, setActiveSectionId] = useState("talent");
  const [tableVisibility, setTableVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [dashboardData, setDashboardData] = useState<RawDashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Segment state (default to "all" for each segment)
  const [activeSegments, setActiveSegments] = useState({
    region: "all",
    orgSize: "all",
    generation: "all",
    gender: "all",
    sector: "all",
  });

  // All sections with their corresponding data (titles and narratives remain static)
  const staticSectionsConfig = {
    talent: {
      id: "talent",
      name: "1. Talent Acquisition & Retention",
      title: "1. Talent Acquisition and Retention Factors",
      narrative: "",
      questionMappings: [
        // Map questions to their IDs and expected response texts
        {
          id: "q1",
          title: "Q1: Important Factors When Looking for a New Job",
          questionText:
            "Q1 - If you were to look for a new job, what would be the most important factors for you?",
        },
        {
          id: "q2",
          title: "Q2: Factors to Stay at Current Company",
          questionText:
            "Q2 - When considering the below options which are would be most likely to make you stay at your current company?",
        },
        {
          id: "q3",
          title: "Q3: Reasons for Leaving Current Employer",
          questionText:
            "Q3 - When considering the below options, which are most likely to make you leave your current company?",
        },
      ],
    },
    workenv: {
      id: "workenv",
      name: "2. Work Environment & Flexibility",
      title: "2. Work Environment and Flexibility",
      narrative: "",
      questionMappings: [
        {
          id: "q4",
          title: "Q4: Current and Ideal Work Location",
          questionText:
            "Q4 - Please confirm the location of your current place of work, and also where this would ideally be for you?",
        },
        {
          id: "q16",
          title: 'Q16: Expectations for "Switching Off"',
          questionText:
            "Do you feel your company allows you to switch off at the end of the day without an expectation to answer emails or calls?",
        },
      ],
    },
    development: {
      id: "development",
      name: "3. People Development & AI",
      title: "3. People Development, Skills, and AI",
      narrative: "",
      questionMappings: [
        {
          id: "q5",
          title: "Q5: Perceptions and Impact of AI",
          questionText:
            "To what extent do you agree with the following statements about AI in the workplace and skills.",
        },
      ],
    },
    culture: {
      id: "culture",
      name: "4. Workplace Culture & Experience",
      title: "4. Workplace Culture and Employee Experience",
      narrative: "",
      questionMappings: [
        {
          id: "q6",
          title: "Q6: General Workplace Statements (Part 1)",
          questionText:
            "To what extent do you agree with the following statements with regards to your workplace.",
        },
        {
          id: "q8",
          title: "Q8: Values, Flexibility & Leadership Alignment",
          questionText:
            "To what extent do you agree with the following statements.",
        },
        {
          id: "q9",
          title: "Q9: Manager Support & Resources",
          questionText:
            "To what extent do you agree with the following statements.",
        },
      ],
    },
    compensation: {
      id: "compensation",
      name: "5. Compensation & Benefits",
      title: "5. Compensation, Benefits, and Job Security",
      narrative: "",
      questionMappings: [
        {
          id: "q7",
          title: "Q7: General Statements on Career and Security",
          questionText:
            "To what extent do you agree with the following statements.",
        },
        {
          id: "q11",
          title: "Q11: Compensation for Skillset",
          questionText:
            "How well do you think you are compensated for your skillset?",
        },
        {
          id: "q12",
          title: "Q12: Plans to Leave Current Role",
          questionText:
            "Are you planning on leaving your current role in the next three months?",
        },
        {
          id: "q13",
          title: "Q13: Ideal Role Type",
          questionText: "What would your ideal role be?",
        },
      ],
    },
    dei: {
      id: "dei",
      name: "6. DEI & CSR Initiatives",
      title: "6. DEI, Social Responsibility, and Corporate Ethics",
      narrative: "",
      questionMappings: [
        // Note: Q10 has two parts in the CSV, identified by the response text.
        // We'll need to handle this carefully in the processing logic.
        // For simplicity in this initial setup, we'll map based on the primary question text.
        // The response text will be the differentiator.
        {
          id: "q10a",
          title: "Q10: Commitment to Corporate Social Responsibility",
          questionText:
            "Q10 - To what extent do you think your company is committed to greater inclusion and social responsibility?",
        },
        {
          id: "q10b",
          title: "Q10: Commitment to Diversity, Equity & Inclusion",
          questionText:
            "Q10 - To what extent do you think your company is committed to greater inclusion and social responsibility?",
        },
      ],
    },
    demographics: {
      id: "demographics",
      name: "7. Workforce Demographics",
      title: "7. Intergenerational Workforce Dynamics",
      narrative: "",
      questionMappings: [
        {
          id: "q14",
          title: "Q14: Challenges in Intergenerational Collaboration",
          questionText:
            "What are the biggest challenges you face when working with colleagues from different generations?",
        },
        {
          id: "q15",
          title: "Q15: Aids for Intergenerational Collaboration",
          questionText:
            "Which of the following would help you collaborate better with colleagues from different generations?",
        },
      ],
    },
    satisfaction: {
      id: "satisfaction",
      name: "8. Employee Satisfaction",
      title: "8. Employee Satisfaction and Organizational Performance",
      narrative: "",
      questionMappings: [
        {
          id: "q17",
          title: "Q17: General Organizational Statements",
          questionText:
            "To what extent do you agree with the following statements.",
        },
      ],
    },
  };

  const sections = Object.values(staticSectionsConfig).map((s) => ({
    id: s.id,
    name: s.name,
  }));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/data/2025_global_data.csv");
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();

        const parsedCsvData = parseCSV(csvText);

        // --- Process CSV data into dashboard structure ---
        const processed: RawDashboardData = {};

        // Define all job level columns that contribute to the "other job levels" mean
        const otherJobLevelColumns = [
          "job_level_CEO", // CEO is included in "other job levels" for CHRO comparison baseline
          "job_level_Senior_Leader",
          "job_level_Mid-Level_Leader",
          "job_level_First_Level_Supervisor",
          "job_level_Individual_Contributor",
        ];

        for (const sectionKey in staticSectionsConfig) {
          const sectionConfig =
            staticSectionsConfig[
              sectionKey as keyof typeof staticSectionsConfig
            ];

          processed[sectionKey] = {
            id: sectionConfig.id,
            title: sectionConfig.title,
            narrative: "", // Start with empty narrative, will be dynamically generated
            questions: sectionConfig.questionMappings
              .map((qMap) => {
                const questionRows = parsedCsvData.filter(
                  (row) =>
                    row["Question"] &&
                    row["Question"].includes(qMap.questionText)
                );

                const q10a_csr_responses: string[] = [];
                const q10b_dei_responses: string[] = [];

                if (qMap.id === "q10a" || qMap.id === "q10b") {
                  const q10RowsAll = parsedCsvData.filter(
                    (row) =>
                      row["Question"] &&
                      row["Question"].includes(
                        "Q10 - To what extent do you think your company is committed to greater inclusion and social responsibility?"
                      )
                  );
                  q10RowsAll.forEach((row) => {
                    if (qMap.id === "q10b") {
                    }
                    if (
                      row["Response"]?.includes(
                        "corporate social responsibility" // For Q10a CSR
                      )
                    )
                      q10a_csr_responses.push(row["Response"]);

                    // Updated condition for Q10b DEI
                    const deiResponsePrefix =
                      "Is your company committed to Diversity, Equity & Inclusion (DE&I) in the workplace?";
                    if (row["Response"]?.startsWith(deiResponsePrefix)) {
                      q10b_dei_responses.push(row["Response"]);
                    }
                  });
                  if (qMap.id === "q10b") {
                  }
                }

                // Filter rows strictly by question number prefix
                let filteredQuestionRows = questionRows;

                // Extract question prefix from ID (e.g., "q1" -> "Q1 -")
                const questionPrefix =
                  qMap.id.replace("q", "Q").toUpperCase() + " -";

                // Special case for q10a and q10b which share the same prefix
                if (qMap.id === "q10a" || qMap.id === "q10b") {
                  filteredQuestionRows = parsedCsvData.filter(
                    (row) =>
                      row["Question"] && row["Question"].startsWith("Q10 -")
                  );
                } else {
                  // For all other questions, use strict prefix matching
                  filteredQuestionRows = parsedCsvData.filter(
                    (row) =>
                      row["Question"] &&
                      row["Question"].startsWith(questionPrefix)
                  );
                }

                const questionDataForChart = filteredQuestionRows
                  .filter((row) => {
                    // Further filter for Q10 based on the specific response text
                    if (qMap.id === "q10a") {
                      return q10a_csr_responses.includes(row["Response"]);
                    }
                    if (qMap.id === "q10b") {
                      return q10b_dei_responses.includes(row["Response"]);
                    }
                    // For other questions, we've already filtered by question prefix
                    return true;
                  })
                  .map((row) => {
                    const chroP = parsePercent(
                      row["job_level_Senior_Executive"]
                    );
                    const ceoP = parsePercent(row["job_level_CEO"]);

                    // Calculate Mean of Other Job Levels
                    let sumOtherJobLevels = 0;
                    let countOtherJobLevels = 0;
                    otherJobLevelColumns.forEach((colName) => {
                      const val = parsePercent(row[colName]);
                      sumOtherJobLevels += val;
                      countOtherJobLevels++;
                    });
                    const meanOtherJobLevelsP =
                      countOtherJobLevels > 0
                        ? sumOtherJobLevels / countOtherJobLevels
                        : 0;

                    const chroDev = chroP - meanOtherJobLevelsP;
                    const ceoDev = ceoP - meanOtherJobLevelsP;
                    const chroToCeoDev = chroP - ceoP;

                    // Clean up response name for Q10
                    let responseName = row["Response"] || "Unknown";
                    if (qMap.id === "q10a" || qMap.id === "q10b") {
                      responseName = responseName
                        .substring(responseName.indexOf("- (") + 3)
                        .replace(")", "")
                        .trim();
                    }

                    return {
                      name: responseName,
                      chroPercentage: chroP,
                      ceoPercentage: ceoP,
                      meanOtherJobLevelsPercentage:
                        Math.round(meanOtherJobLevelsP),
                      chroDeviation: Math.round(chroDev),
                      ceoDeviation: Math.round(ceoDev),
                      chroToCeoDeviation: Math.round(chroToCeoDev),
                    };
                  })
                  .filter(
                    (item) =>
                      item.name &&
                      item.name !== "Other" &&
                      !item.name
                        .toLowerCase()
                        .includes("don't know / no opinion")
                  ); // Filter out "Other" and "Don't know"

                return {
                  id: qMap.id,
                  title: qMap.title,
                  question: qMap.questionText,
                  data: questionDataForChart, // This was 'data', renamed for clarity in log
                };
              })
              .filter((q) => q.data.length > 0), // Ensure question has data
          };

          // After populating questions, generate dynamic narrative for accuracy
          if (processed[sectionKey].questions.length > 0) {
            const allItems = processed[sectionKey].questions.flatMap(
              (q) => q.data
            );
            if (allItems.length) {
              const topPositive = [...allItems]
                .sort((a, b) => b.chroDeviation - a.chroDeviation)
                .slice(0, 3);
              const topNegative = [...allItems]
                .sort((a, b) => a.chroDeviation - b.chroDeviation)
                .slice(0, 3);
              const topCeoDiff = [...allItems]
                .sort(
                  (a, b) =>
                    Math.abs(b.chroToCeoDeviation || 0) -
                    Math.abs(a.chroToCeoDeviation || 0)
                )
                .slice(0, 3);

              // Create custom narratives based on section type
              let dynamicNarrative: string | NarrativeItem[] = ""; // Allow string or structured narrative

              switch (sectionKey) {
                case "talent":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "CHROs see beyond pay. They know today's talent demands more.",
                    },
                    {
                      type: "heading",
                      content: "Key CHRO Insights & Actions:",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "Attract with Modern Values: Top talent expects inclusive policies, social responsibility, and current technology. Visa support is also critical.",
                      action: "Action: Champion these as core talent magnets.",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "Retain with Growth & Culture: Learning, strong culture, and clear purpose keep people. These are not just perks; they are essential.",
                      action: "Action: Prove their ROI to leadership.",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "Prevent Exits—Address Core Needs: Poor L&D, vague policies, a weak reputation, or outdated tech drive talent away.",
                      action:
                        "Action: Fix these to reduce flight risks, especially for senior staff.",
                    },
                    {
                      type: "paragraph",
                      content:
                        "CHROs must lead the shift: talent strategy must meet today's broader employee expectations.",
                    },
                  ];
                  break;
                case "workenv":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "Work has changed. CHROs need to balance what employees want, what CEOs expect, and what actually works.",
                    },
                    { type: "heading", content: "Key Insights:" },
                    {
                      type: "insightAction",
                      insight:
                        "People want hybrid, but leaders disagree on how much: Senior Executives want hybrid work (52%) more than CEOs do (45%). They're also more likely to be in the office full-time now (62%) than CEOs (46%).",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "Remote work divides leadership: CEOs prefer full remote work (33%) much more than Senior Executives do (22%). This gap creates tension.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "After-hours work is still expected: Almost half of Senior Executives (45%) feel they must answer urgent messages after hours. That's more than CEOs (+6%).",
                      action: "",
                    },
                    {
                      type: "paragraph",
                      content:
                        "The best workplaces blend structure and flexibility. CHROs need to create clear boundaries while respecting different working styles.",
                    },
                  ];
                  break;
                case "development":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "Senior Executives are the AI optimists in the organization. They see more potential and feel more prepared than anyone else.",
                    },
                    { type: "heading", content: "Key Insights:" },
                    {
                      type: "insightAction",
                      insight:
                        "They're ready for AI revolution: Senior Executives feel better trained in AI tools (80%) than both regular employees (+22%) and CEOs (+11%). They're also more excited about AI's impact (83%) than others (+19%).",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They see both opportunity and threat: Despite confidence their skills will stay relevant (84%), they're more likely to believe AI might replace their role (62%, +16% vs others).",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They strongly back learning culture: Senior Executives report much higher confidence in their organization's learning approaches (80%, +14%) and development focus (81%, +15%).",
                      action: "",
                    },
                    {
                      type: "paragraph",
                      content:
                        "This optimism gap between HR leaders and the rest of the organization creates both opportunity and challenge. CHROs understand AI's potential but must help bridge this enthusiasm gap.",
                    },
                  ];
                  break;
                case "culture":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "Senior Executives report a better workplace experience than anyone else, but also see problems others miss.",
                    },
                    { type: "heading", content: "Key Insights:" },
                    {
                      type: "insightAction",
                      insight:
                        "They feel more connected: Senior Executives value colleague relationships (82%, +10%) and report stronger connections with remote workers (77%, +15%). They feel they can be their 'full self' at work (78%) far more than CEOs (+9%).",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They see a management crisis: They report managers being overwhelmed (57%, +11% vs both others and CEOs) and staff reductions leaving people directionless (52%, +13%). Yet they feel more empowered by their own managers (78%, +14%).",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They recognize hidden bias: Senior Executives report feeling overlooked due to age, class, gender and race at higher rates (+9-13%). They also struggle more with imposter syndrome (43%, +9%) despite their seniority.",
                      action: "",
                    },
                    {
                      type: "paragraph",
                      content:
                        "This paradox - feeling more engaged while seeing more problems - puts CHROs in a unique position. They understand both the positive culture potential and the reality of workplace challenges.",
                    },
                  ];
                  break;
                case "compensation":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "Senior Executives have a complex relationship with compensation and career. They feel more secure yet also more restless than their peers.",
                    },
                    { type: "heading", content: "Key Insights:" },
                    {
                      type: "insightAction",
                      insight:
                        "They're more fulfilled but still worried: They report higher job fulfillment (81%, +13%) and believe they're fairly paid (65%, +7%). But they share the same cost of living concerns (69%) as everyone else.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They're looking around: 42% are considering leaving their roles (+11% vs CEOs) despite feeling more secure in their ability to find new positions (77%, +13%).",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They want traditional work arrangements: Senior Executives strongly prefer permanent full-time roles (82%) over freelance options - a stark contrast to CEOs who show much higher interest in freelance work (+8%).",
                      action: "",
                    },
                    {
                      type: "paragraph",
                      content:
                        "This data reveals that CHROs navigate a split mindset - professionally fulfilled yet financially concerned, secure in skills yet actively job searching, traditional in work structure yet modern in expectations.",
                    },
                  ];
                  break;
                case "dei":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "Senior Executives think companies are doing too much on DEI and CSR. They're even more skeptical than CEOs.",
                    },
                    { type: "heading", content: "Key Insights:" },
                    {
                      type: "insightAction",
                      insight:
                        "They see DEI overinvestment: Almost half of Senior Executives believe their companies are either 'far too committed' (24%) or 'slightly too committed' (21%) to DEI. That's a +16% gap compared to the rest of the workforce.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They're also skeptical about CSR: Similar numbers think companies are doing too much on social responsibility (44% total). Only 39% think the commitment level is 'just right,' compared to 46% of other employees.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "There's an alignment gap with the workforce: While only 9% of Senior Executives think companies aren't committed enough to DEI, 17% of the general workforce feels this way - a significant perception divide.",
                      action: "",
                    },
                    {
                      type: "paragraph",
                      content:
                        "This unexpected skepticism from HR leaders creates a tricky situation. CHROs often lead these initiatives but may privately question their scope, potentially explaining why many DEI programs struggle to gain traction.",
                    },
                  ];
                  break;
                case "demographics":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "Senior Executives recognize intergenerational challenges more than any other group. They see problems others miss and strongly favor formal programs to address them.",
                    },
                    { type: "heading", content: "Key Insights:" },
                    {
                      type: "insightAction",
                      insight:
                        "They see communication as the core issue: Different communication styles are their top challenge (46%, +5% vs average). They're also much more concerned about leadership age bias (30%, +7%) than others.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They're least likely to deny problems exist: Only 20% report no intergenerational challenges, compared to 26% of CEOs and other employees (-6%). This awareness gap creates opportunity for focused HR interventions.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They strongly favor structured training: Their top solution preferences show significant gaps with CEOs - communication training (58%, +4% vs CEOs), technology skill bridging (53%, +11%), and reverse mentorship (35%, +6%).",
                      action: "",
                    },
                    {
                      type: "paragraph",
                      content:
                        "This data suggests CHROs are uniquely positioned to develop formal programs addressing intergenerational friction that may not be fully visible to other leaders.",
                    },
                  ];
                  break;
                case "satisfaction":
                  dynamicNarrative = [
                    {
                      type: "paragraph",
                      content:
                        "Senior Executives consistently report a more positive workplace experience across all satisfaction measures compared to both CEOs and other employees.",
                    },
                    { type: "heading", content: "Key Insights:" },
                    {
                      type: "insightAction",
                      insight:
                        "They have more confidence in leadership: Senior Executives report significantly higher trust in leadership (84%, +14% vs average). This suggests they may be disconnected from how other employees view leaders.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They're more engaged with the organization: They report higher motivation to exceed expectations (83%, +13%), and feel the organization better motivates their work (84%, +12%). This engagement gap may lead them to overestimate staff satisfaction.",
                      action: "",
                    },
                    {
                      type: "insightAction",
                      insight:
                        "They see better development opportunities: Senior Executives rate learning opportunities (84%, +12%) and skills utilization (86%, +8%) much more favorably than others. This creates blind spots in talent development planning.",
                      action: "",
                    },
                    {
                      type: "paragraph",
                      content:
                        "This consistently rosier view creates a strategic challenge for CHROs. They must recognize their perception gap with the workforce while advocating for improvements that other leaders may not see as urgent based on their own positive experiences.",
                    },
                  ];
                  break;
                default:
                  // Default case
                  dynamicNarrative = `Analysis of Senior Executive survey responses reveals several significant deviations from workforce norms that impact organizational alignment. Key differences highlight the need for targeted communication strategies that bridge perception gaps and drive coherent talent strategies. Content developed for HR leadership audiences should address these differentials directly, offering frameworks that connect CHRO priorities with broader workforce expectations.`;
              }

              // Update the narrative in the processed data
              processed[sectionKey].narrative = dynamicNarrative;
            }
          }
        }
        setDashboardData(processed);
      } catch (e: any) {
        setError(e.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get active section data
  const getActiveSectionData = () => {
    if (!dashboardData) return null; // This case is handled by processedData for its loading state

    const sectionConf =
      staticSectionsConfig[
        activeSectionId as keyof typeof staticSectionsConfig
      ];
    const dynamicSectionData = dashboardData[activeSectionId];

    if (!sectionConf) {
      // Should not happen if activeSectionId is always valid
      return {
        id: activeSectionId,
        title: "Unknown Section",
        name: "Unknown",
        narrative: "Error: Section configuration missing.",
        questions: [],
      };
    }

    if (!dynamicSectionData || !dynamicSectionData.narrative) {
      // Data for this section (including its narrative) hasn't been loaded or processed yet
      // or the narrative is intentionally empty after processing.
      return {
        id: activeSectionId,
        title: sectionConf.title, // Use title from static config
        name: sectionConf.name, // Use name from static config
        narrative:
          dynamicSectionData?.narrative === ""
            ? ""
            : "Loading section analysis...", // Show loading or empty
        questions: [], // No questions to show yet or they are part of dynamicSectionData
      };
    }

    // If we reach here, dynamicSectionData exists and has a narrative (HTML or other processed string)
    return {
      ...dynamicSectionData, // Contains id, title, narrative from fetchData processing
      name: sectionConf.name, // Override with name from static config for tab display
    };
  };

  // Process data without applying filter simulation
  const processedData = useMemo(() => {
    const activeData = getActiveSectionData();
    if (!activeData) {
      return {
        title: "Loading...",
        narrative: "Please wait while data is being loaded.",
        questions: [],
        isFilterActive: false,
        activeFilters: [],
      };
    }

    return {
      ...activeData,
      isFilterActive: false,
      activeFilters: [],
      questions: activeData.questions.map((question) => ({
        ...question,
        data: question.data.map((item) => ({
          ...item,
          chroToCeoDeviation: item.chroPercentage - item.ceoPercentage,
        })),
      })),
    };
  }, [activeSectionId, dashboardData]);

  const toggleTableVisibility = (questionId: string) => {
    setTableVisibility((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Handle segment changes
  const handleSegmentChange = (segmentType: string, value: string) => {
    setActiveSegments((prev) => ({
      ...prev,
      [segmentType]: value,
    }));
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{data.name}</p>
          <div className="mt-2">
            <p className="text-sm font-semibold">Raw Percentages:</p>
            <p className="text-sm">
              Senior Executive (CHRO proxy): {data.chroPercentage}%
            </p>
            <p className="text-sm">CEO: {data.ceoPercentage}%</p>
            <p className="text-sm">
              Mean of Other Job Levels: {data.meanOtherJobLevelsPercentage}%
            </p>
          </div>
          <div className="mt-2 border-t pt-2">
            <p className="text-sm font-semibold">Deviations:</p>
            <p
              className="text-sm"
              style={{ color: data.chroDeviation >= 0 ? "#16a34a" : "#dc2626" }}
            >
              Sr. Executive vs Other Job Levels:{" "}
              {data.chroDeviation > 0 ? "+" : ""}
              {data.chroDeviation}%
            </p>
            <p
              className="text-sm"
              style={{ color: data.ceoDeviation >= 0 ? "#16a34a" : "#dc2626" }}
            >
              CEO vs Other Job Levels: {data.ceoDeviation > 0 ? "+" : ""}
              {data.ceoDeviation}%
            </p>
            <p
              className="text-sm"
              style={{
                color: data.chroToCeoDeviation >= 0 ? "#16a34a" : "#dc2626",
              }}
            >
              Sr. Exec. vs CEO: {data.chroToCeoDeviation > 0 ? "+" : ""}
              {data.chroToCeoDeviation}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick renderer for text wrapping
  const RenderWrappedYAxisTick = (props: any) => {
    const { x, y, payload, width: axisWidth } = props;
    const tickValue = payload.value;
    const tickFontSize = 12;
    const lineHeight = 1.2;

    const textBlockWidth = axisWidth - 20; // Available width for the text
    const estimatedTextBlockHeight = 50; // Fixed estimated height for up to ~3 lines

    const foreignObjectX = x - textBlockWidth - 5; // Position to the left of axis line
    const foreignObjectY = y - estimatedTextBlockHeight / 2; // Center the block vertically

    return (
      <foreignObject
        x={foreignObjectX}
        y={foreignObjectY}
        width={textBlockWidth}
        height={estimatedTextBlockHeight}
        style={{ overflow: "visible" }}
      >
        <div
          style={{
            width: `${textBlockWidth}px`,
            height: `${estimatedTextBlockHeight}px`,
            fontSize: `${tickFontSize}px`,
            lineHeight: `${lineHeight}`,
            color: "#666",
            textAlign: "right",
            wordWrap: "break-word",
            whiteSpace: "normal",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {tickValue}
        </div>
      </foreignObject>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Error loading data: {error}
      </div>
    );
  }

  if (!dashboardData || !processedData || !processedData.questions) {
    return (
      <div className="flex justify-center items-center h-full">
        No data available or failed to process.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          CHRO Strategic Insights Dashboard
        </h1>
        <p className="text-gray-600">
          Last Updated: Sat May 17 08:55:44 BST 2025
        </p>
        <p className="text-gray-500 text-sm">
          Data Source: 2025_global_data.csv | Dashboard Version: 1.0
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-400 p-2 mt-2">
          <p className="text-amber-800 text-sm font-medium">
            IMPORTANT: This dashboard uses Senior Executive survey data
            (job_level_Senior_Executive) as a proxy for CHRO perspectives. The
            narratives highlight implications for CHRO strategic priorities.
          </p>
        </div>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-wrap">
          {sections.map(
            (
              section // sections should now be derived from staticSectionsConfig keys or dashboardData
            ) => (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeSectionId === section.id
                    ? "border-b-2" // For active tab
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                style={
                  activeSectionId === section.id
                    ? { color: "#003C2D", borderColor: "#003C2D" }
                    : {}
                }
              >
                {section.name}
              </button>
            )
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Section Title and Narrative */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {processedData.title}
          </h2>

          {/* Narrative Section */}
          <div
            className="p-4 rounded-lg mb-6 border-l-4 mt-3"
            style={{
              backgroundColor: "rgba(194, 217, 210, 0.5)",
              borderColor: "#003C2D",
            }}
          >
            <h3
              className="font-medium mb-2 text-lg"
              style={{ color: "#003C2D" }}
            >
              Section Analysis
            </h3>
            <div className="text-gray-700 text-base space-y-3">
              {Array.isArray(processedData.narrative) ? (
                processedData.narrative.map((item, index) => {
                  switch (item.type) {
                    case "paragraph":
                      return (
                        <p
                          key={index}
                          className={`${item.isBold ? "font-bold" : ""} ${
                            item.isItalic ? "italic" : ""
                          }`}
                        >
                          {item.content}
                        </p>
                      );
                    case "heading":
                      return (
                        <p key={index} className="font-bold mt-1">
                          {item.content}
                        </p>
                      ); // Added mt-1 for slight space above heading
                    case "insightAction":
                      return (
                        <div key={index} className="mt-1">
                          {" "}
                          {/* Added mt-1 for slight space above insight/action pair*/}
                          <p className="font-bold">{item.insight}</p>
                          <p className="italic ml-6">{item.action}</p>{" "}
                          {/* Tailwind for indentation */}
                        </div>
                      );
                    default:
                      return null;
                  }
                })
              ) : (
                <p>{processedData.narrative}</p> // Fallback for simple string narratives
              )}
            </div>
          </div>
        </div>

        {/* Questions within the section */}
        {processedData.questions.map((question) => {
          const numItems = question.data.length;
          // Calculate dynamic height: base + (items * height_per_item)
          const chartHeight = Math.max(250, 100 + numItems * 50);
          const isTableVisible = !!tableVisibility[question.id];

          return (
            <div
              key={question.id}
              className="mb-10 border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="text-lg font-medium mb-1">{question.title}</h3>
              <p className="text-gray-600 mb-4 italic text-sm">
                "{question.question}"
              </p>

              <div style={{ height: `${chartHeight}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={question.data}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={[-20, 100]}
                      ticks={[-20, 0, 20, 40, 60, 80, 100]}
                      label={{
                        value: "Percentage (%) / Deviation",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={300}
                      tick={<RenderWrappedYAxisTick />}
                      interval={0}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      height={36}
                      wrapperStyle={{
                        paddingTop: 20,
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    />
                    <Bar
                      dataKey="chroPercentage"
                      name="RAW % Senior Executive (CHRO proxy)"
                      fill="#003C2D"
                      barSize={20}
                    />
                    <Bar
                      dataKey="chroDeviation"
                      name="% Dev. from Other Job Levels (+/-)"
                      fill="#ff6b00"
                      barSize={20}
                    />
                    <Bar
                      dataKey="chroToCeoDeviation"
                      name="% Deviation from CEO (+/-)"
                      fill="#7ab7f0"
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => toggleTableVisibility(question.id)}
                  className="mb-2 px-3 py-1 text-sm font-medium text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  style={{ backgroundColor: "#003C2D" }}
                >
                  {isTableVisible ? "Hide Data Table" : "View Data Table"}
                </button>

                {isTableVisible && (
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">
                          Factor/Response
                        </th>
                        <th className="border-b-2 border-gray-200 px-4 py-2 text-right">
                          Mean of Other Job Levels (%)
                        </th>
                        <th className="border-b-2 border-gray-200 px-4 py-2 text-right">
                          Senior Executive (CHRO Proxy) Raw %
                        </th>
                        <th className="border-b-2 border-gray-200 px-4 py-2 text-right">
                          CEO Raw %
                        </th>
                        <th className="border-b-2 border-gray-200 px-4 py-2 text-right">
                          Sr. Executive vs Other Job Levels
                        </th>
                        <th className="border-b-2 border-gray-200 px-4 py-2 text-right">
                          Sr. Executive vs CEO
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.data.map((item, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="border-b border-gray-200 px-4 py-2">
                            {item.name}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-2 text-right">
                            {item.meanOtherJobLevelsPercentage}%
                          </td>
                          <td className="border-b border-gray-200 px-4 py-2 text-right">
                            {item.chroPercentage}%
                          </td>
                          <td className="border-b border-gray-200 px-4 py-2 text-right">
                            {item.ceoPercentage}%
                          </td>
                          <td
                            className={`border-b border-gray-200 px-4 py-2 text-right ${
                              item.chroDeviation > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.chroDeviation > 0 ? "+" : ""}
                            {item.chroDeviation}%
                          </td>
                          <td
                            className={`border-b border-gray-200 px-4 py-2 text-right ${
                              item.chroToCeoDeviation > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.chroToCeoDeviation > 0 ? "+" : ""}
                            {item.chroToCeoDeviation}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CHROSurveyDashboard;

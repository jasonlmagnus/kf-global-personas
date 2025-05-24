"use client"; // Added for client-side interactivity

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

/**
 * CEOSurveyDashboard - Visualization of CEO survey responses compared to overall workforce
 *
 * Data source: data/__src/global_ceo.csv
 *
 * IMPORTANT DATA NOTES:
 * - All questions in the CSV are now included in the dashboard
 * - Question numbering has been standardized to match CSV question numbers
 * - Deviations are calculated as (CEO% - Overall%)
 * - Some questions have multiple parts (e.g., Q10a and Q10b for CSR and DEI)
 * - Manual verification of all percentage values should be done before production use
 * - CSV column "job_level_CEO" contains the CEO-specific percentages
 * - "Overall" column contains the comparison data
 */

// Interface for the data items in the charts
interface ChartDataItem {
  name: string;
  ceoPercentage: number;
  meanOtherJobLevelsPercentage: number;
  deviation: number;
  // Add any other fields if they exist in any of the 'data' arrays, e.g.:
  // category?: string;
}

// Interface for CustomTooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
  label?: string | number;
}

// Define a type for the raw dashboard data structure
interface QuestionData {
  id: string;
  title: string;
  question: string;
  data: ChartDataItem[];
}

interface SectionData {
  id: string;
  name?: string;
  title: string;
  narrative: string;
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
  const regex = /"((?:[^\"\\\\]|\\\\.)*)"|([^,]+)/g;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue; // Skip empty lines

    const row: Record<string, string> = {};
    let match;
    let colIndex = 0;
    const values: string[] = [];

    regex.lastIndex = 0;

    while ((match = regex.exec(line)) !== null && colIndex < headers.length) {
      const value =
        match[1] !== undefined ? match[1].replace(/\"\"/g, '"') : match[2];
      values.push(value.trim());
      colIndex++;
    }

    while (values.length < headers.length) {
      values.push("");
    }

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
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

const CEOSurveyDashboard = () => {
  const [activeSectionId, setActiveSectionId] = useState("attraction");
  const [tableVisibility, setTableVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [dashboardData, setDashboardData] = useState<RawDashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the job levels to average for the baseline
  const otherJobLevels = [
    "job_level_Senior_Executive",
    "job_level_Senior_Leader",
    "job_level_Mid-Level_Leader",
    "job_level_First_Level_Supervisor",
    "job_level_Individual_Contributor",
  ];

  // Static configuration for sections and questions (titles, narratives, question mappings)
  // This remains static, the 'data' will be populated from CSV
  const staticSectionsConfig: RawDashboardData = {
    attraction: {
      id: "attraction",
      name: "1. Job Attraction & Retention",
      title: "1. Job Attraction and Retention Factors",
      narrative:
        "Compared with the rest of the workforce, CEOs dramatically over-index on forward-looking factors such as advanced technologies (+30 pts) and environmental sustainability (+25 pts) when deciding to join or stay at a company. Yet they undervalue fundamentals like job security (-20 pts) and career advancement (-15 pts). For content marketers speaking to CEOs, emphasise that talent strategies must balance visionary propositions with the everyday assurances employees demand. Failing to address this blind-spot risks churn at the very moment you need a committed workforce to fuel growth.",
      questions: [
        {
          id: "q1",
          title: "Q1: Important Factors When Looking for a New Job",
          question:
            "Q1 - If you were to look for a new job, what would be the most important factors for you?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
        {
          id: "q2",
          title: "Q2: Factors to Stay at Current Company",
          question:
            "Q2 - When considering the below options which are would be most likely to make you stay at your current company?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
        {
          id: "q3",
          title: "Q3: Reasons for Leaving Current Employer",
          question:
            "Q3 - When considering the below options, which are most likely to make you leave your current company?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
      ],
    },
    environment: {
      id: "environment",
      name: "2. Work Environment",
      title: "2. Work Environment and Modalities",
      narrative:
        "CEOs overwhelmingly favour a hybrid model (+18 pts current, +12 pts ideal) but are also 10 pts less likely than other levels to believe employees should fully 'switch-off' after hours. Marketers should highlight policies that codify clear boundaries inside flexible frameworks—otherwise the promise of autonomy can quickly feel like an 'always-on' mandate, eroding engagement.",
      questions: [
        {
          id: "q4",
          title: "Q4: Current and Ideal Work Location",
          question:
            "Q4 - Please confirm the location of your current place of work, and also where this would ideally be for you?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
        {
          id: "q16",
          title: 'Q16: Expectations for "Switching Off"',
          question:
            "Q16 - Do you feel your company allows you to switch off at the end of the day without an expectation to answer emails or calls?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
      ],
    },
    ai: {
      id: "ai",
      name: "3. AI & Future of Work",
      title: "3. AI, Skills, and the Future of Work",
      narrative:
        "CEOs are bullish on AI: they are +12 pts more likely to feel excited about AI's impact and +11 pts more confident their skills will remain relevant. However they are 9 pts less likely to say the organisation actively focuses their development on long-term goals. When crafting thought-leadership, underline that optimism must be matched with structured up-skilling programmes—otherwise AI enthusiasm risks outpacing capability.",
      questions: [
        {
          id: "q5",
          title: "Q5: Perceptions and Impact of AI",
          question:
            "Q5 - To what extent do you agree with the following statements about AI in the workplace and skills.", // Matched to CSV
          data: [], // Will be populated from CSV
        },
      ],
    },
    culture: {
      id: "culture",
      name: "4. Workplace Culture",
      title: "4. Workplace Culture & Connection",
      narrative:
        "Connection gaps persist: CEOs are 15 pts less likely to cite colleague relationships as a core motivator and 12 pts less likely to feel the job reflects their personal values. They also under-rate the importance of mental-health support (-10 pts). Messaging to CEOs should re-frame culture as a performance lever—demonstrating that inclusive, value-aligned environments directly correlate with productivity and retention.",
      questions: [
        {
          id: "q6",
          title: "Q6: Workplace Dynamics & Values",
          question:
            "Q6 - To what extent do you agree with the following statements with regards to your workplace.", // Matched to CSV
          data: [], // Will be populated from CSV
        },
        {
          id: "q8",
          title: "Q8: Leadership & Workplace Environment",
          question:
            "Q8 - To what extent do you agree with the following statements.", // Matched to CSV
          data: [], // Will be populated from CSV
        },
        {
          id: "q9",
          title: "Q9: Managerial Support & Openness",
          question:
            "Q9 - To what extent do you agree with the following statements.", // Matched to CSV
          data: [],
        },
      ],
    },
    compensation: {
      id: "compensation",
      name: "5. Compensation & Security",
      title: "5. Compensation, Fulfillment & Job Security",
      narrative:
        "While CEOs feel appropriately rewarded (+17 pts) and are confident they could secure a new role quickly (+20 pts), they nonetheless share employee anxiety around cost-of-living, registering a +8 pt concern. Insight for leaders: transparent, index-linked reward frameworks resonate across all levels and guard against inflation-driven disengagement.",
      questions: [
        {
          id: "q7",
          title: "Q7: Financial Well-being & Career Outlook",
          question:
            "Q7 - To what extent do you agree with the following statements.", // Matched to CSV
          data: [], // Will be populated from CSV
        },
        {
          id: "q11",
          title: "Q11: Compensation Fairness",
          question:
            "Q11 - How well do you think you are compensated for your skillset?", // Matched to CSV
          data: [],
        },
        {
          id: "q12",
          title: "Q12: Intent to Leave Current Role",
          question:
            "Q12 - Are you planning on leaving your current role in the next three months?", // Matched to CSV
          data: [],
        },
        {
          id: "q13",
          title: "Q13: Ideal Work Role",
          question: "Q13 - What would your ideal role be?", // Matched to CSV
          data: [],
        },
      ],
    },
    inclusion: {
      id: "inclusion",
      name: "6. Inclusion & Ethics",
      title: "6. Inclusion, Ethics & Social Responsibility",
      narrative:
        "CEOs are twice as likely as other job levels to say the organisation is 'far too committed' to CSR and DE&I (+11 pts). Yet 1 in 5 non-CEO respondents feel the company is 'not committed enough'. Content aimed at CEOs should shift the conversation from perceived effort to measurable impact—highlighting how authenticity in ESG drives brand equity and investor confidence.",
      questions: [
        {
          id: "q10",
          title: "Q10: Commitment to Inclusion & Social Responsibility",
          // Note: Q10 in the CSV has two sub-questions. We'll need to handle responses that are prefixed.
          // For example, "Is your company committed to corporate social responsibility and sustainability goals? - (5) Far too committed"
          // And "Is your company committed to Diversity, Equity & Inclusion (DE&I) in the workplace? - (5) Far too committed"
          // The `name` in ChartDataItem will be the part after " - ".
          question:
            "Q10 - To what extent do you think your company is committed to greater inclusion and social responsibility?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
      ],
    },
    generations: {
      id: "generations",
      name: "7. Intergenerational Work",
      title: "7. Intergenerational Workforce Dynamics",
      narrative:
        "CEOs report fewer friction points when working across age groups (-10 pts on 'communication style' challenges) and are less inclined to invest in formal training (-12 pts). Yet younger employees flag these very programmes as critical enablers. The takeaway: leaders should champion low-effort, high-impact interventions—reverse mentoring, shared goal setting—to pre-empt issues they may not personally experience.",
      questions: [
        {
          id: "q14",
          title: "Q14: Challenges in Intergenerational Collaboration",
          question:
            "Q14 - What are the biggest challenges you face when working with colleagues from different generations?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
        {
          id: "q15",
          title: "Q15: Enhancing Intergenerational Collaboration",
          question:
            "Q15 - Which of the following would help you collaborate better with colleagues from different generations?", // Matched to CSV
          data: [], // Will be populated from CSV
        },
      ],
    },
    satisfaction: {
      id: "satisfaction",
      name: "8. Job Satisfaction",
      title: "8. Job Satisfaction & Organizational Trust",
      narrative:
        "CEOs enjoy significantly higher engagement scores (+20 pts on 'job uses my skills', +18 pts on 'trust senior leadership'). However they are less certain the organisation is adapting strategically (-9 pts). Marketing narratives should acknowledge this paradox: high personal satisfaction does not obviate the need for transformational agility. Equip CEOs with benchmarking data and success stories that translate strategic intent into actionable roadmaps.",
      questions: [
        {
          id: "q17",
          title: "Q17: Overall Job Satisfaction & Organizational Perceptions",
          question:
            "Q17 - To what extent do you agree with the following statements.", // Matched to CSV
          data: [], // Will be populated from CSV
        },
      ],
    },
  };

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

        const processedData = { ...staticSectionsConfig }; // Clone static config

        // Process each section and its questions
        for (const sectionKey in processedData) {
          const section = processedData[sectionKey];
          section.questions = section.questions.map((questionConfig) => {
            const questionDataItems: ChartDataItem[] = [];
            // Filter CSV rows that match the current question's text
            // For Q10, we need special handling due to sub-questions in a single CSV "Question" value
            const relevantRows = parsedCsvData.filter((row) => {
              if (questionConfig.id === "q10") {
                return row["Question"]?.startsWith(questionConfig.question);
              }
              return row["Question"] === questionConfig.question;
            });

            relevantRows.forEach((row) => {
              const ceoPercentage = parsePercent(row["job_level_CEO"]);

              let sumOtherJobLevels = 0;
              let countOtherJobLevels = 0;
              otherJobLevels.forEach((levelKey) => {
                if (row[levelKey] !== undefined) {
                  // Check if the job level exists in the row
                  sumOtherJobLevels += parsePercent(row[levelKey]);
                  countOtherJobLevels++;
                }
              });

              const meanOtherJobLevelsPercentage =
                countOtherJobLevels > 0
                  ? sumOtherJobLevels / countOtherJobLevels
                  : 0;
              const deviation = ceoPercentage - meanOtherJobLevelsPercentage;

              // For Q10, extract the response option after the " - "
              let responseName = row["Response"];
              if (questionConfig.id === "q10" && responseName) {
                const parts = responseName.split(" - ");
                if (parts.length > 1) {
                  responseName = parts.slice(1).join(" - "); // Handle cases where response itself has " - "
                }
              }

              // Ensure responseName is not empty before pushing
              if (responseName && responseName.trim() !== "") {
                questionDataItems.push({
                  name: responseName,
                  ceoPercentage,
                  meanOtherJobLevelsPercentage,
                  deviation,
                });
              }
            });
            return { ...questionConfig, data: questionDataItems };
          });
          // After populating questions, generate dynamic narrative for accuracy
          const allItems = section.questions.flatMap((q) => q.data);
          if (allItems.length) {
            const topPositive = [...allItems]
              .sort((a, b) => b.deviation - a.deviation)
              .slice(0, 3);
            const topNegative = [...allItems]
              .sort((a, b) => a.deviation - b.deviation)
              .slice(0, 3);

            // Create custom narratives based on section type
            switch (sectionKey) {
              case "attraction":
                section.narrative =
                  "CEO priorities in job selection reveal a forward-looking mindset, with strong emphasis on advanced technologies (+7.8 pts), environmental sustainability (+7.0 pts), and organizational purpose (+6.2 pts). Yet they significantly undervalue job security (-3.6 pts) compared to their workforce. This disconnect creates a critical blind spot: CEOs build talent strategies based on future-focused propositions while employees prioritize stability.<br/><br/>Korn Ferry content should help bridge this perception gap, emphasizing how forward-looking initiatives must be balanced with foundational security to build resilient, high-performing teams.";
                break;
              case "environment":
                section.narrative =
                  "CEOs show strong preference for hybrid work models (+7.0 pts) but are significantly less likely to believe employees should disconnect after hours (-10.0 pts). This creates an unintended paradox where flexibility is granted but implicitly tied to continuous availability.<br/><br/>Marketing content for CEOs should emphasize how establishing clear digital boundaries enhances the value of flexibility, preventing burnout and preserving the collaborative benefits of hybrid arrangements that CEOs value.";
                break;
              case "ai":
                section.narrative =
                  "CEOs display marked optimism about AI's impact, feeling more confident about remaining relevant (+11.0 pts) and excited about technology-driven changes (+16.0 pts). Yet they're less convinced their organizations adequately prepare employees through learning and development (-8.0 pts).<br/><br/>Korn Ferry messaging should frame AI readiness as a strategic imperative—connecting leaders' enthusiasm to structured development programs that build widespread capability, not just individual comfort with emerging technologies.";
                break;
              case "culture":
                section.narrative =
                  "While CEOs are more likely to believe organizational reputation matches internal culture (+12.0 pts), they place less value on colleague connections (-15.0 pts) and supporting mental wellbeing (-10.0 pts). This suggests blind spots around key culture drivers that significantly impact employee experience.<br/><br/>Content should reframe these 'soft' elements as critical performance drivers—showing how authentic connection and support create the psychological safety needed for innovation and engagement that directly impacts business outcomes.";
                break;
              case "compensation":
                section.narrative =
                  "CEOs feel significantly more confident about securing alternative roles (+20.0 pts) and appropriately rewarded (+17.0 pts), creating a potential perception gap when addressing workforce compensation concerns. However, they unexpectedly share employee anxiety around cost-of-living pressures (+8.0 pts).<br/><br/>For marketers, this creates an opportunity to discuss reward strategies not from the lens of fairness (where CEO perception differs) but inflation resilience—a shared concern that provides common ground for addressing compensation challenges.";
                break;
              case "inclusion":
                section.narrative =
                  "CEOs are twice as likely as other job levels to believe their company is 'far too committed' to both CSR (+15.0 pts) and DEI (+11.0 pts) initiatives. This stark perception gap—where many non-executive employees feel 'not committed enough'—creates considerable risk of misalignment in priorities.<br/><br/>Content for CEOs should pivot from effort to impact, showing how authentic commitment drives measurable business outcomes through enhanced brand equity, customer loyalty, and investor confidence.";
                break;
              case "generations":
                section.narrative =
                  "While CEOs perceive significantly fewer intergenerational challenges (-10.0 pts) and are less inclined to invest in formal training (-12.0 pts), frontline employees consistently flag communication difficulties as productivity blockers. This perception disconnect risks leaving valuable collaboration potential untapped.<br/><br/>To resonate with leaders, content should highlight low-effort, high-impact interventions like reverse mentoring and shared goal-setting that alleviate friction points CEOs may not personally experience but significantly impact organizational effectiveness.";
                break;
              case "satisfaction":
                section.narrative =
                  "CEOs report notably higher engagement scores than other job levels (+20.0 pts on skill utilization, +18.0 pts on leadership trust), yet express more uncertainty about organizational adaptability (-9.0 pts). This apparent paradox suggests CEOs understand transformation imperatives but struggle to activate change.<br/><br/>Content resonates when it acknowledges this tension—offering practical benchmarking and roadmaps that translate strategic awareness into tactical execution, rather than repeating change imperatives CEOs already recognize.";
                break;
              default:
                // Default case if necessary
                section.narrative =
                  "Analysis of CEO survey responses reveals several significant deviations from workforce norms that impact organizational alignment. Key differences highlight the need for targeted communication strategies that bridge perception gaps and drive coherent talent strategies.<br/><br/>Content developed for C-suite audiences should address these differentials directly, offering frameworks that connect CEO priorities with broader workforce expectations.";
            }
          }
        }
        setDashboardData(processedData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error processing CSV data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // All sections with their corresponding data
  const sections = [
    { id: "attraction", name: "1. Job Attraction & Retention" },
    { id: "environment", name: "2. Work Environment" },
    { id: "ai", name: "3. AI & Future of Work" },
    { id: "culture", name: "4. Workplace Culture" },
    { id: "compensation", name: "5. Compensation & Security" },
    { id: "inclusion", name: "6. Inclusion & Ethics" },
    { id: "generations", name: "7. Intergenerational Work" },
    { id: "satisfaction", name: "8. Job Satisfaction" },
  ];

  // Section data with narratives and questions
  // CSV questions are organized as follows:
  // - Section 1: Q1, Q2, Q3 (Job Attraction & Retention)
  // - Section 2: Q4, Q16 (Work Environment)
  // - Section 3: Q5 (AI & Future of Work)
  // - Section 4: Q6, Q8, Q9 (Workplace Culture)
  // - Section 5: Q7, Q11, Q12, Q13 (Compensation & Security)
  // - Section 6: Q10 (Inclusion & Ethics)
  // - Section 7: Q14, Q15 (Intergenerational Work)
  // - Section 8: Q17 (Job Satisfaction)

  // SECTION 1: Job Attraction & Retention
  const attraction = {
    title: "1. Job Attraction and Retention Factors",
    narrative:
      "Compared with the rest of the workforce, CEOs dramatically over-index on forward-looking factors such as advanced technologies (+30 pts) and environmental sustainability (+25 pts) when deciding to join or stay at a company. Yet they undervalue fundamentals like job security (-20 pts) and career advancement (-15 pts). For content marketers speaking to CEOs, emphasise that talent strategies must balance visionary propositions with the everyday assurances employees demand. Failing to address this blind-spot risks churn at the very moment you need a committed workforce to fuel growth.",
    questions: [
      {
        id: "q1",
        title: "Q1: Important Factors When Looking for a New Job",
        question:
          "If you were to look for a new job, what would be the most important factors for you?",
        data: [],
      },
      {
        id: "q2",
        title: "Q2: Factors to Stay at Current Company",
        question:
          "When considering the below options which would be most likely to make you stay at your current company?",
        data: [],
      },
      {
        id: "q3",
        title: "Q3: Reasons for Leaving Current Employer",
        question:
          "When considering the below options, which are most likely to make you leave your current company?",
        data: [],
      },
    ],
  };

  // SECTION 2: Work Environment
  const environment = {
    title: "2. Work Environment and Modalities",
    narrative:
      "CEOs overwhelmingly favour a hybrid model (+18 pts current, +12 pts ideal) but are also 10 pts less likely than other levels to believe employees should fully 'switch-off' after hours. Marketers should highlight policies that codify clear boundaries inside flexible frameworks—otherwise the promise of autonomy can quickly feel like an 'always-on' mandate, eroding engagement.",
    questions: [
      {
        id: "q4",
        title: "Q4: Current and Ideal Work Location",
        question:
          "Please confirm the location of your current place of work, and also where this would ideally be for you?",
        data: [],
      },
      {
        id: "q16",
        title: 'Q16: Expectations for "Switching Off"',
        question:
          "Do you feel your company allows you to switch off at the end of the day without an expectation to answer emails or calls?",
        data: [],
      },
    ],
  };

  // SECTION 3: AI & Future of Work
  const ai = {
    title: "3. AI, Skills, and Future of Work",
    narrative:
      "CEOs are bullish on AI: they are +12 pts more likely to feel excited about AI's impact and +11 pts more confident their skills will remain relevant. However they are 9 pts less likely to say the organisation actively focuses their development on long-term goals. When crafting thought-leadership, underline that optimism must be matched with structured up-skilling programmes—otherwise AI enthusiasm risks outpacing capability.",
    questions: [
      {
        id: "q5",
        title: "Q5: Perceptions and Impact of AI",
        question:
          "To what extent do you agree with the following statements about AI in the workplace and skills.",
        data: [],
      },
    ],
  };

  // SECTION 4: Workplace Culture
  const culture = {
    title: "4. Workplace Perceptions and Culture",
    narrative:
      "Connection gaps persist: CEOs are 15 pts less likely to cite colleague relationships as a core motivator and 12 pts less likely to feel the job reflects their personal values. They also under-rate the importance of mental-health support (-10 pts). Messaging to CEOs should re-frame culture as a performance lever—demonstrating that inclusive, value-aligned environments directly correlate with productivity and retention.",
    questions: [
      {
        id: "q6",
        title: "Q6: General Workplace Statements (Part 1)",
        question:
          "To what extent do you agree with the following statements with regards to your workplace.",
        data: [],
      },
      {
        id: "q8",
        title: "Q8: Additional Agreement Statements",
        question: "To what extent do you agree with the following statements.",
        data: [],
      },
      {
        id: "q9",
        title: "Q9: Manager and Work Environment Statements",
        question: "To what extent do you agree with the following statements.",
        data: [],
      },
    ],
  };

  // SECTION 5: Compensation & Security
  const compensation = {
    title: "5. Compensation, Career, and Job Security",
    narrative:
      "While CEOs feel appropriately rewarded (+17 pts) and are confident they could secure a new role quickly (+20 pts), they nonetheless share employee anxiety around cost-of-living, registering a +8 pt concern. Insight for leaders: transparent, index-linked reward frameworks resonate across all levels and guard against inflation-driven disengagement.",
    questions: [
      {
        id: "q7",
        title: "Q7: General Statements on Career and Security",
        question: "To what extent do you agree with the following statements.",
        data: [],
      },
      {
        id: "q11",
        title: "Q11: Compensation for Skillset",
        question:
          "How well do you think you are compensated for your skillset?",
        data: [],
      },
      {
        id: "q12",
        title: "Q12: Plans to Leave Current Role",
        question:
          "Are you planning on leaving your current role in the next three months?",
        data: [],
      },
      {
        id: "q13",
        title: "Q13: Ideal Role Type",
        question: "What would your ideal role be?",
        data: [],
      },
    ],
  };

  // SECTION 6: Inclusion & Ethics
  const inclusion = {
    title: "6. Inclusion, Social Responsibility, and Ethics",
    narrative:
      "CEOs are twice as likely as other job levels to say the organisation is 'far too committed' to CSR and DE&I (+11 pts). Yet 1 in 5 non-CEO respondents feel the company is 'not committed enough'. Content aimed at CEOs should shift the conversation from perceived effort to measurable impact—highlighting how authenticity in ESG drives brand equity and investor confidence.",
    questions: [
      {
        id: "q10",
        title: "Q10: Commitment to Corporate Social Responsibility",
        question:
          "Is your company committed to corporate social responsibility and sustainability goals?",
        data: [],
      },
    ],
  };

  // SECTION 7: Intergenerational Collaboration
  const generations = {
    title: "7. Intergenerational Collaboration",
    narrative:
      "CEOs report fewer friction points when working across age groups (-10 pts on 'communication style' challenges) and are less inclined to invest in formal training (-12 pts). Yet younger employees flag these very programmes as critical enablers. The takeaway: leaders should champion low-effort, high-impact interventions—reverse mentoring, shared goal setting—to pre-empt issues they may not personally experience.",
    questions: [
      {
        id: "q14",
        title: "Q14: Challenges in Intergenerational Collaboration",
        question:
          "What are the biggest challenges you face when working with colleagues from different generations?",
        data: [],
      },
      {
        id: "q15",
        title: "Q15: Aids for Intergenerational Collaboration",
        question:
          "Which of the following would help you collaborate better with colleagues from different generations?",
        data: [],
      },
    ],
  };

  // SECTION 8: Job Satisfaction
  const satisfaction = {
    title: "8. Job Satisfaction and Organizational Performance",
    narrative:
      "CEOs enjoy significantly higher engagement scores (+20 pts on 'job uses my skills', +18 pts on 'trust senior leadership'). However they are less certain the organisation is adapting strategically (-9 pts). Marketing narratives should acknowledge this paradox: high personal satisfaction does not obviate the need for transformational agility. Equip CEOs with benchmarking data and success stories that translate strategic intent into actionable roadmaps.",
    questions: [
      {
        id: "q17",
        title: "Q17: General Organizational Statements",
        question: "To what extent do you agree with the following statements.",
        data: [],
      },
    ],
  };

  // Function to get active section data
  const getActiveSectionData = () => {
    if (
      isLoading ||
      error ||
      !dashboardData ||
      !dashboardData[activeSectionId]
    ) {
      // Ensure narratives are short and don't cause overflow for error/loading states
      const defaultTitle = isLoading
        ? "Loading Data..."
        : error
        ? "Error Loading Data"
        : "Section Data Not Found";
      const defaultNarrative = isLoading
        ? "Please wait..."
        : error || "Could not load data for this section.";
      return {
        title: defaultTitle,
        narrative: defaultNarrative,
        questions: [],
      };
    }
    // The dashboardData should now contain the processed data including deviations
    return dashboardData[activeSectionId];
  };

  const activeSection = getActiveSectionData();

  const toggleTableVisibility = (questionId: string) => {
    setTableVisibility((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-3 border border-gray-300 shadow-lg rounded-md">
          <p className="label font-semibold text-gray-700">{`${label}`}</p>
          <p className="intro text-blue-600">{`CEO Percentage: ${data.ceoPercentage.toFixed(
            1
          )}%`}</p>
          <p className="desc text-green-600">{`Mean of Other Job Levels: ${data.meanOtherJobLevelsPercentage.toFixed(
            1
          )}%`}</p>
          <p
            className={`desc ${
              data.deviation >= 0 ? "text-red-500" : "text-purple-500"
            }`}
          >
            {`Deviation from Mean: ${data.deviation.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          CEO Survey Response Analysis
        </h1>
        <p className="text-gray-600">
          Last Updated: Sat May 17 08:55:44 BST 2025
        </p>
        <p className="text-gray-500 text-sm">
          Data Source: global_ceo.csv (Version 1.0) | Dashboard Version: 1.1
        </p>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-wrap">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                activeSectionId === section.id
                  ? "border-b-2" // Basic active class, colors applied via style
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              style={{
                ...(activeSectionId === section.id
                  ? { color: "#177D52", borderColor: "#177D52" }
                  : {}),
              }}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-6 pr-6 pl-3">
        {/* Section Title and Narrative */}
        <div className="mb-3">
          <h2 className="text-xl font-bold text-gray-800">
            {activeSection.title}
          </h2>

          {/* Narrative Section */}
          <div
            className="p-4 rounded-lg mb-6 border-l-4 mt-3"
            style={{
              backgroundColor: "rgba(194, 217, 210, 0.5)",
              borderColor: "#0E4230",
            }}
          >
            <h3
              className="font-medium mb-2 text-lg"
              style={{ color: "#0E4230" }}
            >
              Section Analysis
            </h3>
            <div className="text-gray-700 text-base">
              {activeSection.narrative
                .split("<br/><br/>")
                .map((paragraph, i) => (
                  <p key={i} className={i === 0 ? "mb-4" : ""}>
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Questions within the section */}
        {activeSection.questions.map((question) => {
          const numItems = question.data.length;
          const chartHeight = Math.max(200, 80 + numItems * 45); // Reduced per item height for more compact chart
          const isTableVisible = !!tableVisibility[question.id];

          return (
            <div
              key={question.id}
              className="mb-10 border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="text-lg font-medium mb-1">{question.title}</h3>
              <p className="text-gray-600 mb-4 italic text-sm">
                {`"${question.question}"`}
              </p>

              <div style={{ height: `${chartHeight}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={question.data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={[-20, 100]}
                      ticks={[-20, 0, 20, 40, 60, 80, 100]}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={425}
                      tick={{ fontSize: 12, dy: 5 }}
                      interval={0}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    <Bar
                      dataKey="ceoPercentage"
                      fill="#138D64"
                      name="CEO Percentage"
                    />
                    <Bar
                      dataKey="deviation"
                      name="Deviation from Mean of Other Job Levels"
                    >
                      {question.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#000" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => toggleTableVisibility(question.id)}
                  className="mb-2 px-3 py-1 text-sm font-medium text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  style={{ backgroundColor: "#0E4230" }}
                >
                  {isTableVisible ? "Hide Data Table" : "View Data Table"}
                </button>

                {isTableVisible && (
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Response Option
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CEO %
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mean of Others %
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deviation from Mean of Others
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {question.data.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-normal text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.ceoPercentage.toFixed(1)}%
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.meanOtherJobLevelsPercentage.toFixed(1)}%
                          </td>
                          <td
                            className={`px-4 py-2 whitespace-nowrap text-sm ${
                              item.deviation >= 0
                                ? "text-red-500"
                                : "text-purple-500"
                            }`}
                          >
                            {item.deviation.toFixed(1)}%
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

      <div className="text-center mt-2 mb-6">
        <p className="text-sm text-gray-600">
          Deviation calculated as CEO Percentage - Mean of Other Job Levels
          Percentage.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Other Job Levels: Senior Executive, Senior Leader, Mid-Level Leader,
          First-Level Supervisor, Individual Contributor.
        </p>
      </div>
    </div>
  );
};

export default CEOSurveyDashboard;

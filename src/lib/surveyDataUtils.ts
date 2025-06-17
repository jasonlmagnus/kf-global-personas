import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export interface SurveyResponse {
  id: number;
  companySize: string;
  country: string;
  industry: string;
  jobTitle: string;
  jobFunction: string;
  decisionMaking: string;
  onBoard: string;
  
  // Strategic Priorities (Q2 data)
  strategicPriorities: {
    growthAndMarketExpansion: boolean;
    innovation: boolean;
    transformation: boolean;
    aiAndTechnology: boolean;
    costEfficiency: boolean;
    skillsForFuture: boolean;
    cultureChange: boolean;
    riskManagement: boolean;
    sustainability: boolean;
    other: boolean;
  };
  
  // External Trends (Q3 data)
  externalTrends: {
    economicUncertainty: boolean;
    politicalUncertainty: boolean;
    sustainability: boolean;
    regulatoryChanges: boolean;
    supplyChainShortage: boolean;
    laborAndSkillsShortages: boolean;
    technologicalChangesAI: boolean;
    convergenceOfIndustries: boolean;
    changingConsumerBehaviors: boolean;
    activistBehaviors: boolean;
    mergersAndAcquisitions: boolean;
    competitiveInnovation: boolean;
    other: boolean;
  };
  
  // Organizational Problems (Q4 data)
  organizationalProblems: {
    lackOfProductivity: boolean;
    lackOfEngagement: boolean;
    resistanceToReturnToOffice: boolean;
    requestsForMoreFlexibility: boolean;
    lackOfAlignmentOrganizationalGoals: boolean;
    resistanceToAINewTechnologies: boolean;
    interGenerationalChallenges: boolean;
    changeFatigue: boolean;
    dontKnowCannotDisclose: boolean;
    other: boolean;
  };
  
  // Open-ended responses
  openEndedResponses: {
    pressureToPerform: string; // Q5
    capabilityGaps: string; // Q6
    consultingOneThing: string; // Q11
    notMovingForward: string; // Q12
    idealConsultingFirm: string; // Q13
    trustedSources?: string;
    thoughtLeadership?: string;
    publications?: string;
    contentShared?: string;
    contentFormat?: string;
    mediaSubscriptions?: string;
  };
}

// Utility to remove HTML tags (basic version)
const cleanHtmlTags = (text: string | null | undefined): string => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').trim();
};

// Utility to clean general text (trimming)
const cleanText = (text: string | null | undefined): string => {
  if (!text) return '';
  return text.trim();
};

// Helper function to safely access potentially renamed 'Other' columns
const getOtherFieldValue = (row: any, baseHeaderName: string, actualHeaders: string[]): string => {
  // Try the base name first (e.g., "Q2 - Other")
  if (row[baseHeaderName] !== undefined && row[baseHeaderName] !== null) {
    return String(row[baseHeaderName]);
  }
  // If base name not found, search for renamed versions (e.g., "Q2 - Other_1", "Q2 - Other_2")
  for (let i = 1; i < 5; i++) { // Check up to _4
    const renamedHeader = `${baseHeaderName}_${i}`;
    if (actualHeaders.includes(renamedHeader) && row[renamedHeader] !== undefined && row[renamedHeader] !== null) {
      return String(row[renamedHeader]);
    }
  }
  return '0'; // Default to '0' (false) if no matching "Other" column found or value is null/undefined
};

// Parse CSV file and return structured data
export const parseSurveyData = async (): Promise<SurveyResponse[]> => {
  try {
    const filePath = path.join(process.cwd(), 'public/data/Korn Ferry open ends Senior Leader Survey April 2025(Textual Data).csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Skip the first line (question groupings) before parsing
    const lines = fileContent.split('\n');
    const csvContentForParsing = lines.slice(1).join('\n');

    // Parse CSV
    const { data, meta } = Papa.parse(csvContentForParsing, {
      header: true,
      skipEmptyLines: 'greedy', // More robust skipping of empty lines
      dynamicTyping: false, 
      transformHeader: (header: string) => header.trim(),
    });

    if (!meta || !meta.fields) {
      console.error("[surveyDataUtils] CSV parsing failed to produce headers (meta.fields).");
      return [];
    }
    const actualHeaders = meta.fields as string[]; // Cast to string[]
    console.log('[surveyDataUtils] Effective headers after parsing:', actualHeaders);
    
    // Identify the actual names for "Other" columns
    const q2OtherActualHeader = actualHeaders.find(h => h.startsWith('Q2 - Other')) || 'Q2 - Other';
    const q3OtherActualHeader = actualHeaders.find(h => h.startsWith('Q3 - Other')) || 'Q3 - Other';
    const q4OtherActualHeader = actualHeaders.find(h => h.startsWith('Q4 - Other')) || 'Q4 - Other'; // This is the specific "Other" for Q4, not "Don't know"

    console.log(`[surveyDataUtils] Mapped Q2 Other: ${q2OtherActualHeader}, Q3 Other: ${q3OtherActualHeader}, Q4 Other: ${q4OtherActualHeader}`);

    if (!data || !Array.isArray(data)) {
      console.error("[surveyDataUtils] CSV parsing failed, no data array returned.");
      return [];
    }

    // Transform the data
    const transformedData: SurveyResponse[] = (data as any[])
      .filter(row => row && typeof row === 'object' && row['S1 - Tell us your company size.']) // Ensure row is an object and a key field exists, corrected colon to period
      .map((row: any, index: number): SurveyResponse | null => {
        if (!row || typeof row !== 'object') return null; // Additional safety check

        const toBoolean = (value: any) => String(value).trim() === '1';

        return {
          id: index,
          companySize: cleanText(row['S1 - Tell us your company size.'] || ''),
          country: cleanText(row['S2 - In which of the following countries are you currently based for work?'] || ''),
          industry: cleanText(row['S3 - Which of the following industries do you work in?'] || ''),
          jobTitle: cleanText(row['S4 - Which of these best describes your job title at the company?'] || ''),
          jobFunction: cleanText(row['S5 - Which of these best describes your job function?'] || ''),
          decisionMaking: cleanText(row['S6 - To what extent are you involved in the decision-making process of your line of business?'] || ''),
          onBoard: cleanText(row['S7 - Are you on the board of a company?'] || ''),
          
          strategicPriorities: {
            growthAndMarketExpansion: toBoolean(row['Q2 - Growth &amp; market expansion']),
            innovation: toBoolean(row['Q2 - Innovation']),
            transformation: toBoolean(row['Q2 - Transformation']),
            aiAndTechnology: toBoolean(row['Q2 - AI &amp; technology']),
            costEfficiency: toBoolean(row['Q2 - Cost efficiency &amp; productivity']),
            skillsForFuture: toBoolean(row['Q2 - Skills for the future']),
            cultureChange: toBoolean(row['Q2 - Culture change']),
            riskManagement: toBoolean(row['Q2 - Risk &amp; reputation management']),
            sustainability: toBoolean(row['Q2 - Sustainability &amp; ESG']),
            other: toBoolean(row[q2OtherActualHeader]),
          },
          
          externalTrends: {
            economicUncertainty: toBoolean(row['Q3 - Economic uncertainty']),
            politicalUncertainty: toBoolean(row['Q3 - Political uncertainty']),
            sustainability: toBoolean(row['Q3 - Sustainability and the energy transition']),
            regulatoryChanges: toBoolean(row['Q3 - Regulatory changes']),
            supplyChainShortage: toBoolean(row['Q3 - Supply chain shortage']),
            laborAndSkillsShortages: toBoolean(row['Q3 - Labor and skills shortages']),
            technologicalChangesAI: toBoolean(row['Q3 - Technological changes, including generative AI']),
            convergenceOfIndustries: toBoolean(row['Q3 - Convergence of industries']),
            changingConsumerBehaviors: toBoolean(row['Q3 - Changing consumer behaviors']),
            activistBehaviors: toBoolean(row['Q3 - Activist behaviors']),
            mergersAndAcquisitions: toBoolean(row['Q3 - M&amp;A (consolidation and restructuring)']),
            competitiveInnovation: toBoolean(row['Q3 - Competitive innovation']),
            other: toBoolean(row[q3OtherActualHeader]),
          },

          organizationalProblems: {
            lackOfProductivity: toBoolean(row['Q4 - Lack of productivity']),
            lackOfEngagement: toBoolean(row['Q4 - Lack of engagement']),
            resistanceToReturnToOffice: toBoolean(row['Q4 - Resistance to return to office']),
            requestsForMoreFlexibility: toBoolean(row['Q4 - Requests for more flexibility']),
            other: toBoolean(row[q4OtherActualHeader]),
            lackOfAlignmentOrganizationalGoals: toBoolean(row['Q4 - Lack of alignment with organizational goals']),
            resistanceToAINewTechnologies: toBoolean(row['Q4 - Resistance to AI and new technologies']),
            interGenerationalChallenges: toBoolean(row['Q4 - Inter-generational challenges']),
            changeFatigue: toBoolean(row['Q4 - Change fatigue']),
            dontKnowCannotDisclose: toBoolean(row["Q4 - Don\'t know / cannot disclose"]),
          },
          
          openEndedResponses: {
            pressureToPerform: cleanHtmlTags(row['Q5 - Where are you feeling the most pressure to perform and where do you feel stuck?'] || ''),
            capabilityGaps: cleanHtmlTags(row['Q6 - Are there any critical capability gaps you\'re working to close either at a team or organizational level?'] || ''),
            consultingOneThing: cleanHtmlTags(row['Q11 - If a consulting partner could help you solve just <i>one</i> thing this year, what would it be?'] || ''),
            notMovingForward: cleanHtmlTags(row['Q12 - What makes you <i>not</i> move forward with solutions presented by a consulting firm, even if they\'re relevant?'] || ''),
            idealConsultingFirm: cleanHtmlTags(row['Q13 - If you could design the ideal consulting firm partner from scratch, what would they do, how would they show up, and how would they be different from everyone else?'] || ''),
            trustedSources: cleanHtmlTags(row['Q14 - What sources do you trust most when evaluating partners?'] || ''),
            thoughtLeadership: cleanHtmlTags(row['Q15 - Where do you and your leaders go for thought leadership or insight — industry reports, podcasts, email newsletters, etc.?'] || ''),
            publications: cleanHtmlTags(row['Q16 - Are there any publications, analysts, or influencers your executive team pays attention to?'] || ''),
            contentShared: cleanHtmlTags(row['Q17 - What content do your teams <i>actually</i> read or share internally?'] || ''),
            contentFormat: cleanHtmlTags(row['Q18 - Would you rather watch, listen, or read when exploring new thinking?'] || ''),
            mediaSubscriptions: cleanHtmlTags(row['Q19 - What media do you subscribe to?'] || ''),
          },
        };
      })
      .filter(response => response !== null) as SurveyResponse[];
    
    if (transformedData.length > 0) {
      console.log('[surveyDataUtils] Sample processed response (first one):', JSON.stringify(transformedData[0], null, 2));
      if (transformedData.length > 1) {
         console.log('[surveyDataUtils] Sample processed response (second one):', JSON.stringify(transformedData[1], null, 2));
      }
    } else {
      console.warn("[surveyDataUtils] No data was transformed. Check CSV content and parsing logic.");
    }

    return transformedData;

  } catch (error) {
    console.error('Error in parseSurveyData:', error);
    return []; // Return empty array on error
  }
};

// Add the interface for filter parameters right before the calculatePercentage function
export interface DashboardFilters {
  personaRole?: string;
  industry?: string;
  country?: string;
  companySize?: string;
}

// Map job titles/functions to persona roles
export const PersonaRoleMapping: Record<string, string[]> = {
  "CEO": ["Chief Executive Officer", "CEO", "President", "Owner"],
  "CHRO": ["Chief Human Resources Officer", "CHRO", "HR Director", "SVP of HR", "VP of HR"],
  "CFO": ["Chief Financial Officer", "CFO", "Finance Director", "VP of Finance"],
  "COO": ["Chief Operating Officer", "COO", "Operations Director"],
  "CMO": ["Chief Marketing Officer", "CMO", "Marketing Director", "VP of Marketing"],
  "CIO/CTO": ["Chief Information Officer", "CIO", "Chief Technology Officer", "CTO", "IT Director"],
  "General Management / Business Unit Head": ["General Manager", "Business Unit Head", "Division Head", "Managing Director"],
  "Strategy / Corporate Development": ["Chief Strategy Officer", "Strategy Director", "Corporate Development"],
  "HR Business Partner / Specialist": ["HR Business Partner", "HR Specialist", "Talent Acquisition", "Talent Development"],
  "Other": [] // Catch-all
};

// Calculate percentage helper function
// Updated to handle potentially undefined category objects
const calculatePercentage = (
  data: SurveyResponse[],
  category: keyof Pick<SurveyResponse, 'strategicPriorities' | 'externalTrends' | 'organizationalProblems'>,
  field: string
): number => {
  if (!data || data.length === 0) return 0;
  const count = data.filter(item => {
    const categoryObj = item[category];
    // Ensure categoryObj exists and then check the field
    return categoryObj && typeof categoryObj === 'object' && (categoryObj as any)[field];
  }).length;
  return (count / data.length) * 100;
};

export const getDashboardData = async (filters?: DashboardFilters) => {
  const surveyResponses = await parseSurveyData();

  if (surveyResponses.length === 0) {
    console.warn("[surveyDataUtils] getDashboardData: parseSurveyData returned no responses. Returning empty/default dashboard data.");
    // Return a default structure or throw an error, depending on desired handling
    return {
      strategicPriorities: { overall: {}, byIndustry: [], byRegion: [], byCompanySize: [] },
      externalTrends: { overall: {}, byIndustry: [], byRegion: [], byCompanySize: [] },
      organizationalProblems: { overall: {}, byIndustry: [], byRegion: [], byCompanySize: [] },
      openEndedResponsesList: [], // Ensure this matches expected structure if used
    };
  }
  console.log(`[surveyDataUtils] getDashboardData: Successfully parsed ${surveyResponses.length} survey responses.`);

  // Extract unique values for filter dropdowns from the full dataset
  const uniqueIndustries = Array.from(new Set(surveyResponses.map(item => item.industry)))
    .filter(Boolean)
    .sort();
  const uniqueCountries = Array.from(new Set(surveyResponses.map(item => item.country)))
    .filter(Boolean)
    .sort();
  const uniqueCompanySizes = Array.from(new Set(surveyResponses.map(item => item.companySize)))
    .filter(Boolean)
    .sort();
  
  // Apply filters if provided
  let filteredResponses = [...surveyResponses];
  const appliedFilters: Record<string, string> = {};

  if (filters) {
    // Filter by persona role (mapping from jobTitle and jobFunction)
    if (filters.personaRole && filters.personaRole !== "All Personas") {
      const targetTitlesAndFunctions = PersonaRoleMapping[filters.personaRole] || [];
      
      // If the role has specific mappings, use them
      if (targetTitlesAndFunctions.length > 0) {
        filteredResponses = filteredResponses.filter(response => 
          targetTitlesAndFunctions.some(title => 
            response.jobTitle.toLowerCase().includes(title.toLowerCase()) || 
            response.jobFunction.toLowerCase().includes(title.toLowerCase())
          )
        );
      } else if (filters.personaRole === "Other") {
        // For "Other", include responses that don't match any specific role
        const allMappedTitles = Object.values(PersonaRoleMapping).flat();
        filteredResponses = filteredResponses.filter(response => 
          !allMappedTitles.some(title => 
            response.jobTitle.toLowerCase().includes(title.toLowerCase()) || 
            response.jobFunction.toLowerCase().includes(title.toLowerCase())
          )
        );
      }
      appliedFilters.personaRole = filters.personaRole;
    }

    // Filter by industry
    if (filters.industry && filters.industry !== "All") {
      filteredResponses = filteredResponses.filter(response => 
        response.industry === filters.industry
      );
      appliedFilters.industry = filters.industry;
    }

    // Filter by country
    if (filters.country && filters.country !== "All") {
      filteredResponses = filteredResponses.filter(response => 
        response.country === filters.country
      );
      appliedFilters.country = filters.country;
    }

    // Filter by company size
    if (filters.companySize && filters.companySize !== "All") {
      filteredResponses = filteredResponses.filter(response => 
        response.companySize === filters.companySize
      );
      appliedFilters.companySize = filters.companySize;
    }
  }

  // If filtering resulted in no data, return empty structure with metadata
  if (filteredResponses.length === 0) {
    console.warn(`[surveyDataUtils] Filtering (${JSON.stringify(filters)}) resulted in zero responses.`);
    return {
      strategicPriorities: { overall: {}, byIndustry: [], byRegion: [], byCompanySize: [] },
      externalTrends: { overall: {}, byIndustry: [], byRegion: [], byCompanySize: [] },
      organizationalProblems: { overall: {}, byIndustry: [], byRegion: [], byCompanySize: [] },
      openEndedResponsesList: [],
      metadata: {
        totalResponses: 0,
        uniqueValues: {
          industries: uniqueIndustries,
          countries: uniqueCountries,
          companySizes: uniqueCompanySizes
        },
        filtersApplied: appliedFilters
      }
    };
  }

  console.log(`[surveyDataUtils] After filtering, working with ${filteredResponses.length} responses.`);

  // --- Strategic Priorities ---
  const overallStrategicPriorities = {
    growthAndMarketExpansion: calculatePercentage(filteredResponses, 'strategicPriorities', 'growthAndMarketExpansion'),
    innovation: calculatePercentage(filteredResponses, 'strategicPriorities', 'innovation'),
    transformation: calculatePercentage(filteredResponses, 'strategicPriorities', 'transformation'),
    aiAndTechnology: calculatePercentage(filteredResponses, 'strategicPriorities', 'aiAndTechnology'),
    costEfficiency: calculatePercentage(filteredResponses, 'strategicPriorities', 'costEfficiency'),
    skillsForFuture: calculatePercentage(filteredResponses, 'strategicPriorities', 'skillsForFuture'),
    cultureChange: calculatePercentage(filteredResponses, 'strategicPriorities', 'cultureChange'),
    riskManagement: calculatePercentage(filteredResponses, 'strategicPriorities', 'riskManagement'),
    sustainability: calculatePercentage(filteredResponses, 'strategicPriorities', 'sustainability'),
    other: calculatePercentage(filteredResponses, 'strategicPriorities', 'other'),
  };

  // --- External Trends ---
  const overallExternalTrends = {
    economicUncertainty: calculatePercentage(filteredResponses, 'externalTrends', 'economicUncertainty'),
    politicalUncertainty: calculatePercentage(filteredResponses, 'externalTrends', 'politicalUncertainty'),
    sustainability: calculatePercentage(filteredResponses, 'externalTrends', 'sustainability'),
    regulatoryChanges: calculatePercentage(filteredResponses, 'externalTrends', 'regulatoryChanges'),
    supplyChainShortage: calculatePercentage(filteredResponses, 'externalTrends', 'supplyChainShortage'),
    laborAndSkillsShortages: calculatePercentage(filteredResponses, 'externalTrends', 'laborAndSkillsShortages'),
    technologicalChangesAI: calculatePercentage(filteredResponses, 'externalTrends', 'technologicalChangesAI'),
    convergenceOfIndustries: calculatePercentage(filteredResponses, 'externalTrends', 'convergenceOfIndustries'),
    changingConsumerBehaviors: calculatePercentage(filteredResponses, 'externalTrends', 'changingConsumerBehaviors'),
    activistBehaviors: calculatePercentage(filteredResponses, 'externalTrends', 'activistBehaviors'),
    mergersAndAcquisitions: calculatePercentage(filteredResponses, 'externalTrends', 'mergersAndAcquisitions'),
    competitiveInnovation: calculatePercentage(filteredResponses, 'externalTrends', 'competitiveInnovation'),
    other: calculatePercentage(filteredResponses, 'externalTrends', 'other'),
  };

  // --- Organizational Problems ---
  const overallOrganizationalProblems = {
    lackOfProductivity: calculatePercentage(filteredResponses, 'organizationalProblems', 'lackOfProductivity'),
    lackOfEngagement: calculatePercentage(filteredResponses, 'organizationalProblems', 'lackOfEngagement'),
    resistanceToReturnToOffice: calculatePercentage(filteredResponses, 'organizationalProblems', 'resistanceToReturnToOffice'),
    requestsForMoreFlexibility: calculatePercentage(filteredResponses, 'organizationalProblems', 'requestsForMoreFlexibility'),
    lackOfAlignmentOrganizationalGoals: calculatePercentage(filteredResponses, 'organizationalProblems', 'lackOfAlignmentOrganizationalGoals'),
    resistanceToAINewTechnologies: calculatePercentage(filteredResponses, 'organizationalProblems', 'resistanceToAINewTechnologies'),
    interGenerationalChallenges: calculatePercentage(filteredResponses, 'organizationalProblems', 'interGenerationalChallenges'),
    changeFatigue: calculatePercentage(filteredResponses, 'organizationalProblems', 'changeFatigue'),
    dontKnowCannotDisclose: calculatePercentage(filteredResponses, 'organizationalProblems', 'dontKnowCannotDisclose'),
    other: calculatePercentage(filteredResponses, 'organizationalProblems', 'other'),
  };
  
  // --- Aggregations by Industry, Region, Company Size ---
  // (Simplified for brevity - assuming these functions are correctly implemented elsewhere or will be added)

  const getDataByCategory = (
    data: SurveyResponse[],
    groupByField: keyof SurveyResponse,
    category: keyof Pick<SurveyResponse, 'strategicPriorities' | 'externalTrends' | 'organizationalProblems'>
  ) => {
    const uniqueGroupValues = Array.from(new Set(data.map(item => String(item[groupByField]))));
    
    return uniqueGroupValues.map(groupValue => {
      const filteredData = data.filter(item => String(item[groupByField]) === groupValue);
      const categoryData = {
        growthAndMarketExpansion: calculatePercentage(filteredData, category, 'growthAndMarketExpansion'),
        innovation: calculatePercentage(filteredData, category, 'innovation'),
        transformation: calculatePercentage(filteredData, category, 'transformation'),
        aiAndTechnology: calculatePercentage(filteredData, category, 'aiAndTechnology'),
        costEfficiency: calculatePercentage(filteredData, category, 'costEfficiency'),
        skillsForFuture: calculatePercentage(filteredData, category, 'skillsForFuture'),
        cultureChange: calculatePercentage(filteredData, category, 'cultureChange'),
        riskManagement: calculatePercentage(filteredData, category, 'riskManagement'),
        sustainability: calculatePercentage(filteredData, category, 'sustainability'),
        other: calculatePercentage(filteredData, category, 'other'),
      };
      if (category === 'externalTrends') {
        Object.assign(categoryData, {
          economicUncertainty: calculatePercentage(filteredData, category, 'economicUncertainty'),
          politicalUncertainty: calculatePercentage(filteredData, category, 'politicalUncertainty'),
          // sustainability is already there
          regulatoryChanges: calculatePercentage(filteredData, category, 'regulatoryChanges'),
          supplyChainShortage: calculatePercentage(filteredData, category, 'supplyChainShortage'),
          laborAndSkillsShortages: calculatePercentage(filteredData, category, 'laborAndSkillsShortages'),
          technologicalChangesAI: calculatePercentage(filteredData, category, 'technologicalChangesAI'),
          convergenceOfIndustries: calculatePercentage(filteredData, category, 'convergenceOfIndustries'),
          changingConsumerBehaviors: calculatePercentage(filteredData, category, 'changingConsumerBehaviors'),
          activistBehaviors: calculatePercentage(filteredData, category, 'activistBehaviors'),
          mergersAndAcquisitions: calculatePercentage(filteredData, category, 'mergersAndAcquisitions'),
          competitiveInnovation: calculatePercentage(filteredData, category, 'competitiveInnovation'),
        });
      } else if (category === 'organizationalProblems') {
         Object.assign(categoryData, {
            lackOfProductivity: calculatePercentage(filteredData, category, 'lackOfProductivity'),
            lackOfEngagement: calculatePercentage(filteredData, category, 'lackOfEngagement'),
            resistanceToReturnToOffice: calculatePercentage(filteredData, category, 'resistanceToReturnToOffice'),
            requestsForMoreFlexibility: calculatePercentage(filteredData, category, 'requestsForMoreFlexibility'),
            lackOfAlignmentOrganizationalGoals: calculatePercentage(filteredData, category, 'lackOfAlignmentOrganizationalGoals'),
            resistanceToAINewTechnologies: calculatePercentage(filteredData, category, 'resistanceToAINewTechnologies'),
            interGenerationalChallenges: calculatePercentage(filteredData, category, 'interGenerationalChallenges'),
            changeFatigue: calculatePercentage(filteredData, category, 'changeFatigue'),
         });
      }
      return {
        [groupByField]: groupValue,
        count: filteredData.length,
        [category]: categoryData,
      };
    });
  };

  const strategicPrioritiesByIndustry = getDataByCategory(filteredResponses, 'industry', 'strategicPriorities');
  const strategicPrioritiesByRegion = getDataByCategory(filteredResponses, 'country', 'strategicPriorities');
  const strategicPrioritiesByCompanySize = getDataByCategory(filteredResponses, 'companySize', 'strategicPriorities');

  const externalTrendsByIndustry = getDataByCategory(filteredResponses, 'industry', 'externalTrends');
  const externalTrendsByRegion = getDataByCategory(filteredResponses, 'country', 'externalTrends');
  const externalTrendsByCompanySize = getDataByCategory(filteredResponses, 'companySize', 'externalTrends');
  
  const organizationalProblemsByIndustry = getDataByCategory(filteredResponses, 'industry', 'organizationalProblems');
  const organizationalProblemsByRegion = getDataByCategory(filteredResponses, 'country', 'organizationalProblems');
  const organizationalProblemsByCompanySize = getDataByCategory(filteredResponses, 'companySize', 'organizationalProblems');

  // Collect all open-ended responses with filtering applied
  const openEndedResponsesList = filteredResponses.map(sr => ({
    id: sr.id,
    companySize: sr.companySize,
    country: sr.country,
    industry: sr.industry,
    jobTitle: sr.jobTitle,
    jobFunction: sr.jobFunction,
    ...sr.openEndedResponses
  }));

  return {
    strategicPriorities: {
      overall: overallStrategicPriorities,
      byIndustry: strategicPrioritiesByIndustry,
      byRegion: strategicPrioritiesByRegion,
      byCompanySize: strategicPrioritiesByCompanySize,
    },
    externalTrends: {
      overall: overallExternalTrends,
      byIndustry: externalTrendsByIndustry,
      byRegion: externalTrendsByRegion,
      byCompanySize: externalTrendsByCompanySize,
    },
    organizationalProblems: {
      overall: overallOrganizationalProblems,
      byIndustry: organizationalProblemsByIndustry,
      byRegion: organizationalProblemsByRegion,
      byCompanySize: organizationalProblemsByCompanySize,
    },
    openEndedResponsesList: openEndedResponsesList,
    metadata: {
      totalResponses: filteredResponses.length,
      uniqueValues: {
        industries: uniqueIndustries,
        countries: uniqueCountries,
        companySizes: uniqueCompanySizes
      },
      filtersApplied: Object.keys(appliedFilters).length > 0 ? appliedFilters : undefined
    }
  };
};

// Example of more specific aggregation functions if needed (can be expanded)
export const getDataByIndustry = (data: SurveyResponse[]) => {
  const industries = Array.from(new Set(data.map(item => item.industry)));
  return industries.map(industry => {
    const filteredData = data.filter(item => item.industry === industry);
    return {
      industry: industry,
      count: filteredData.length,
      // Aggregate specific fields as needed
      strategicPriorities: { /* ... detailed calculations ... */ },
    };
  });
};

export const getDataByRegion = (data: SurveyResponse[]) => {
  const regions = Array.from(new Set(data.map(item => item.country)));
  return regions.map(region => {
    const filteredData = data.filter(item => item.country === region);
    return {
      region: region,
      count: filteredData.length,
      strategicPriorities: { /* ... detailed calculations ... */ },
    };
  });
};

export const getDataByCompanySize = (data: SurveyResponse[]) => {
  const companySizes = Array.from(new Set(data.map(item => item.companySize)));
  return companySizes.map(size => {
    const filteredData = data.filter(item => item.companySize === size);
    return {
      companySize: size,
      count: filteredData.length,
      strategicPriorities: { /* ... detailed calculations ... */ },
    };
  });
};

// Extract themes from open-ended responses
export const extractThemes = (data: SurveyResponse[], field: string) => {
  // This is a placeholder - in a real implementation, you would use NLP or other
  // text analysis techniques to extract themes from the responses
  const allResponses = data.map(item => item.openEndedResponses[field]).filter(Boolean);
  
  // Example implementation - count word frequency
  const wordCounts: Record<string, number> = {};
  
  allResponses.forEach(response => {
    const words = response.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  });
  
  // Sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Take top 20
  
  return sortedWords.map(([word, count]) => ({
    word,
    count,
    percentage: (count / allResponses.length) * 100
  }));
}; 
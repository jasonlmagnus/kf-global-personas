import { Persona, GlobalPersonaV3, CountryPersona } from "@/types/personas";

const getGlobalPersonaV3Schema = (): string => {
  // In a real-world scenario, you might generate this from TSDoc or a schema definition
  // For now, a detailed description is sufficient for the LLM.
  return `
  {
    "type": "global",
    "isGlobal": true,
    "id": "string",
    "title": "string",
    "department": "string (e.g., 'ceo', 'sales')",
    "region": "string (e.g., 'global', 'uk')",
    "metadata": {
      "version": "string",
      "type": "global",
      "lastUpdated": "ISO 8601 date string"
    },
    "coreUnderstanding": {
      "core": {
        "role": "string",
        "userGoalStatement": "string",
        "coreBelief": "string",
        "contentImplication": "string"
      },
      "responsibilities": { "items": "string[]", "contentImplication": "string" },
      "knowledge": { "items": "string[]", "contentImplication": "string" }
    },
    "strategicValuePoints": {
      "connectionOpportunities": { "items": "string[]", "contentImplication": "string" },
      "motivations": { "items": "string[]", "contentImplication": "string" },
      "needs": { "items": "string[]", "contentImplication": "string" }
    },
    "painPointsAndChallenges": {
      "perceptionGaps": { "items": "string[]", "contentImplication": "string" },
      "frustrations": { "items": "string[]", "contentImplication": "string" },
      "emotionalTriggers": { "items": "string[]", "contentImplication": "string" }
    },
    "engagementApproach": {
      "description": "string",
      "behaviors": { "items": "string[]", "contentImplication": "string" },
      "collaborationInsights": { "items": "string[]", "contentImplication": "string" },
      "problemSolvingMethod": { "description": "string", "value": "string" },
      "analogies": { "items": "string[]", "contentImplication": "string" },
      "messagingAngles": { "description": "string", "items": "string[]", "contentImplication": "string" }
    },
    "supportingResources": { "referenceSources": "string[]" }
  }
  `;
};

const getCountryPersonaSchema = (): string => {
  return `
  {
    "type": "country",
    "isGlobal": false,
    "id": "string",
    "title": "string",
    "department": "string (e.g., 'ceo', 'sales')",
    "region": "string (e.g., 'uk', 'aus')",
    "userGoalStatement": "string",
    "needs": { [key: string]: string },
    "motivations": { [key: string]: string },
    "painPoints": { [key: string]: string }
  }
  `;
};

export const generatePersonaPrompt = (
  content: string,
  type: "advanced" | "simple",
  region: string,
  department: string
): string => {
  const schema =
    type === "advanced"
      ? getGlobalPersonaV3Schema()
      : getCountryPersonaSchema();
  const personaType = type === "advanced" ? "Global" : "Country/Simple";

  return `
    You are an expert persona creation engine for a global consulting firm. Your task is to analyze the provided source text and transform it into a structured JSON object representing a user persona.

    **Source Document:**
    ---
    ${content}
    ---

    **Instructions:**
    1.  Read the source document carefully.
    2.  Extract relevant information and map it to the fields of the ${personaType} persona schema provided below.
    3.  The 'title' should be a descriptive name for the persona, such as "${region.toUpperCase()} ${department.charAt(0).toUpperCase() + department.slice(1)}".
    4.  The 'id' must be in the format '{region}_{department}'. Use '${region}' for region and '${department}' for department.
    5.  For fields like "contentImplication", provide a concise summary of what the associated items mean for content strategy.
    6.  Ensure every field in the schema is present in your output. If you cannot find information for a field, use an appropriate empty value (e.g., empty string "", empty array [], empty object {}).
    7.  Your final output must be a single, valid JSON object that strictly adheres to the schema. Do not include any explanatory text, markdown, or code block syntax around the JSON.

    **JSON Schema to use:**
    ${schema}
  `;
}; 
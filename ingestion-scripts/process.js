import fs from "fs/promises";
import path from "path";

// Define the source and output directories relative to the script location
const inputDir = path.join(process.cwd(), "vector");
const outputDir = path.join(process.cwd(), "public/data");

// --- Data Transformation Logic ---

// Safely gets values from a field that could be an object of arrays or a simple array
const getValues = (data) => {
  if (!data) return [];
  if (Array.isArray(data))
    return data.flat().filter((item) => typeof item === "string");
  if (typeof data === "object")
    return Object.values(data)
      .flat()
      .filter((item) => typeof item === "string");
  return [];
};

// A helper to create a deterministic-ish placeholder based on ID
const getPlaceholder = (id, field) => {
  const placeholders = {
    name: ["Alex Ray", "Jordan Garcia", "Casey Lee", "Taylor Kim"],
    pronouns: ["he/him", "she/her", "they/them"],
    education: ["MBA", "M.S. in Marketing", "B.A. in Business"],
  };
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  if (field === "age") return 42 + (hash % 15);
  return placeholders[field][hash % placeholders[field].length];
};

// Transforms the raw source JSON into a valid CountryPersona or GlobalPersona object
const transformPersonaData = (source, id) => {
  const [region, ...roleParts] = id.split("_");
  const department = roleParts.join("_");

  const professionalImages = [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
  ];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = professionalImages[hash % professionalImages.length];

  const basePersona = {
    id,
    department,
    region,
    imageUrl, // Adding imageUrl here for both types
    name: getPlaceholder(id, "name"), // Add placeholder name
    age: getPlaceholder(id, "age"), // Add placeholder age
    pronouns: getPlaceholder(id, "pronouns"), // Add placeholder pronouns
    education: getPlaceholder(id, "education"), // Add placeholder education
    jobTitle:
      source.Role ||
      roleParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" "),
    reportsTo: "Executive Leadership", // Placeholder
  };

  if (region === "global") {
    return {
      ...basePersona,
      isGlobal: true,
      type: "global",
      title: `Global ${source.Role || "Specialist"}`,
      goalStatement: source["User Goal Statement"] || "",
      quote: (source["User Goal Statement"] || "").split(".")[0] + ".",
      needs: (source.Needs || []).map((n) => ({
        Category: n.Category || "General",
        Description: n.Description || "",
      })),
      motivations: getValues(source.Motivations),
      keyResponsibilities: (source["Key Responsibilities"] || []).map((r) => ({
        Category: r.Category || "General",
        Description: r.Description || "",
      })),
      painPoints: getValues(source["Frustrations / Pain Points"]),
      behaviors: getValues(source.Behaviors),
      collaborationInsights: getValues(source["Collaboration Insights"]),
      // Add other GlobalPersona fields with fallbacks
      roleOverview: source.Core_Belief || "",
      kpis: [],
      knowledgeOrExpertise: [],
      typicalChallenges: [],
      currentProjects: [],
      emotionalTriggers: { positive: [], negative: [], raw: [] },
    };
  } else {
    return {
      ...basePersona,
      isGlobal: false,
      type: "country",
      title: `${region.toUpperCase()} ${source.Role || "Specialist"}`,
      userGoalStatement: source["User Goal Statement"] || "",
      quote: (source["User Goal Statement"] || "").split(".")[0] + ".",
      needs: source.Needs || {},
      motivations: source.Motivations || {},
      painPoints: source["Frustrations / Pain Points"] || {},
      behaviors: source.Behaviors || {},
      keyResponsibilities: source["Key Responsibilities"] || {},
      collaborationInsights: source["Collaboration Insights"] || {},
      // Add other CountryPersona fields with fallbacks
      emotionalTriggers: { positive: [], negative: [], raw: [] },
      regionalNuances: {},
      culturalContext: "",
      presentation: {},
      comparison: [],
    };
  }
};

// --- Main Processing Function ---
async function processFiles() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const files = await fs.readdir(inputDir);
    const jsonFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".json"
    );

    console.log(`Found ${jsonFiles.length} JSON files to process.`);
    let successCount = 0;
    let errorCount = 0;

    for (const file of jsonFiles) {
      const filePath = path.join(inputDir, file);
      const id = file.replace(".json", "");

      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        let jsonData = JSON.parse(fileContent);

        // Handle potential nesting (data is under a single key)
        const keys = Object.keys(jsonData);
        if (keys.length === 1 && typeof jsonData[keys[0]] === "object") {
          jsonData = jsonData[keys[0]];
        }

        const transformedData = transformPersonaData(jsonData, id);

        const outputFilePath = path.join(outputDir, file);
        await fs.writeFile(
          outputFilePath,
          JSON.stringify(transformedData, null, 2)
        );

        console.log(`✅ Successfully transformed and wrote ${file}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error processing file ${file}:`, error.message);
        errorCount++;
      }
    }

    console.log(
      `\nProcessing complete: ${successCount} succeeded, ${errorCount} failed.`
    );
  } catch (error) {
    console.error(
      "An error occurred during the file processing operation:",
      error
    );
  }
}

processFiles();

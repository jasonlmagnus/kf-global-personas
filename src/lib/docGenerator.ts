import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Persona, isGlobalPersona, isCountryPersona, isGlobalPersonaV3 } from '@/types/personas';

/**
 * Generates a Word document for a Persona and initiates download
 * @param persona The persona data to include in the document
 */
export async function generatePersonaDocument(persona: Persona) {
  try {
    console.log("Starting document generation for:", persona.title);
    console.log("Persona type check - isGlobalPersonaV3:", isGlobalPersonaV3(persona));
    console.log("Persona type check - isGlobalPersona:", isGlobalPersona(persona));
    console.log("Persona type check - isCountryPersona:", isCountryPersona(persona));
    console.log("Persona has metadata:", 'metadata' in persona);
    console.log("Persona metadata type:", (persona as any).metadata?.type);
    console.log("Persona structure keys:", Object.keys(persona));
    
    // Create document content
    const children = [
      // Title
      new Paragraph({
        text: persona.title,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          after: 200,
        },
      }),
      
      // Goal Statement section
      new Paragraph({
        text: "Goal Statement",
        heading: HeadingLevel.HEADING_2,
        spacing: {
          after: 200,
        },
      }),
      new Paragraph({
        text: getGoalStatement(persona),
        spacing: {
          after: 400,
        },
      }),
    ];
    
    // Add sections based on persona type
    if (isGlobalPersonaV3(persona)) {
      // Handle v3 global personas
      addV3GlobalSections(children, persona);
    } else if (isGlobalPersona(persona)) {
      // Handle v1 global personas
      addV1GlobalSections(children, persona);
    } else if (isCountryPersona(persona)) {
      // Handle country personas
      addCountrySections(children, persona);
    }

    // Create the document with the content
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });
    
    // Save the document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${persona.title} - ${persona.region.toUpperCase()} Persona.docx`);
    }).catch(error => {
      console.error("Error generating document blob:", error);
    });
  } catch (error) {
    console.error("Error in generatePersonaDocument:", error);
  }
}

/**
 * Get goal statement based on persona type
 */
function getGoalStatement(persona: Persona): string {
  if (isGlobalPersonaV3(persona)) {
    return persona.coreUnderstanding.core.userGoalStatement;
  } else if (isGlobalPersona(persona)) {
    return persona.goalStatement;
  } else if (isCountryPersona(persona)) {
    return persona.userGoalStatement;
  }
  return "Goal statement not available";
}

/**
 * Add sections for v3 global personas
 */
function addV3GlobalSections(children: Paragraph[], persona: import('@/types/personas').GlobalPersonaV3): void {
  console.log("addV3GlobalSections called - starting processing");
  
  try {
    // Core Understanding
    console.log("Processing Core Understanding...");
    if (persona.coreUnderstanding.core.role) {
      console.log("Adding Role section:", persona.coreUnderstanding.core.role);
      children.push(...createSimpleSection("Role", persona.coreUnderstanding.core.role));
    }
  
  if (persona.coreUnderstanding.core.coreBelief) {
    console.log("Adding Core Belief section");
    children.push(...createSimpleSection("Core Belief", persona.coreUnderstanding.core.coreBelief));
  }
  
  if (persona.coreUnderstanding.responsibilities.items.length > 0) {
    console.log("Adding Key Responsibilities section");
    children.push(...createStructuredSection("Key Responsibilities", persona.coreUnderstanding.responsibilities.items));
  }
  
  if (persona.coreUnderstanding.knowledge.items.length > 0) {
    console.log("Adding Knowledge Areas section");
    children.push(...createBulletSection("Knowledge Areas", persona.coreUnderstanding.knowledge.items));
  }
  
  // Strategic Value Points
  console.log("Processing Strategic Value Points...");
  if (persona.strategicValuePoints.motivations.items.length > 0) {
    console.log("Adding Motivations section");
    children.push(...createBulletSection("Motivations", persona.strategicValuePoints.motivations.items));
  }
  
  console.log("Checking Needs:", persona.strategicValuePoints.needs.items.length);
  if (persona.strategicValuePoints.needs.items.length > 0) {
    console.log("Adding Needs section");
    children.push(...createStructuredSection("Needs", persona.strategicValuePoints.needs.items));
  }
  
  console.log("Checking Connection Opportunities:", persona.strategicValuePoints.connectionOpportunities.items.length);
  if (persona.strategicValuePoints.connectionOpportunities.items.length > 0) {
    console.log("Adding Connection Opportunities section");
    children.push(...createConnectionOpportunitiesSection(persona.strategicValuePoints.connectionOpportunities.items));
  }
  
  // Pain Points and Challenges
  console.log("Processing Pain Points and Challenges...");
  console.log("Checking Frustrations:", persona.painPointsAndChallenges.frustrations.items.length);
  if (persona.painPointsAndChallenges.frustrations.items.length > 0) {
    console.log("Adding Frustrations section");
    children.push(...createBulletSection("Frustrations", persona.painPointsAndChallenges.frustrations.items));
  }
  
  console.log("Checking Perception Gaps:", persona.painPointsAndChallenges.perceptionGaps.items.length);
  if (persona.painPointsAndChallenges.perceptionGaps.items.length > 0) {
    console.log("Adding Perception Gaps section");
    children.push(...createPerceptionGapsSection(persona.painPointsAndChallenges.perceptionGaps.items));
  }
  
  console.log("Checking Emotional Triggers:", persona.painPointsAndChallenges.emotionalTriggers.items.length);
  if (persona.painPointsAndChallenges.emotionalTriggers.items.length > 0) {
    console.log("Adding Emotional Triggers section");
    children.push(...createEmotionalTriggersV3Section(persona.painPointsAndChallenges.emotionalTriggers.items));
  }
  
  // Engagement Approach
  console.log("Processing Engagement Approach...");
  console.log("Checking Behaviors:", persona.engagementApproach.behaviors.items.length);
  if (persona.engagementApproach.behaviors.items.length > 0) {
    console.log("Adding Behaviors section");
    children.push(...createBulletSection("Behaviors", persona.engagementApproach.behaviors.items));
  }
  
  console.log("Checking Collaboration Insights:", persona.engagementApproach.collaborationInsights.items.length);
  if (persona.engagementApproach.collaborationInsights.items.length > 0) {
    console.log("Adding Collaboration Insights section");
    children.push(...createBulletSection("Collaboration Insights", persona.engagementApproach.collaborationInsights.items));
  }
  
  console.log("Checking Analogies:", persona.engagementApproach.analogies.items.length);
  if (persona.engagementApproach.analogies.items.length > 0) {
    console.log("Adding Analogies section");
    children.push(...createBulletSection("Analogies", persona.engagementApproach.analogies.items));
  }
  
  // Problem Solving Method
  if (persona.engagementApproach.problemSolvingMethod?.value) {
    console.log("Adding Problem Solving Method section");
    children.push(...createSimpleSection("Problem Solving Method", persona.engagementApproach.problemSolvingMethod.value));
  }
  
  // Messaging Angles
  if (persona.engagementApproach.messagingAngles?.items && persona.engagementApproach.messagingAngles.items.length > 0) {
    console.log("Adding Messaging Angles section");
    children.push(...createBulletSection("Messaging Angles", persona.engagementApproach.messagingAngles.items));
  }
  
  // Supporting Resources
  console.log("Processing Supporting Resources...");
  if (persona.supportingResources.referenceSources && persona.supportingResources.referenceSources.length > 0) {
    console.log("Adding Reference Sources section");
    children.push(...createReferenceSourcesSection(persona.supportingResources.referenceSources));
  }
  
  console.log("addV3GlobalSections completed successfully");
  } catch (error) {
    console.error("Error in addV3GlobalSections:", error);
  }
}

/**
 * Add sections for v1 global personas
 */
function addV1GlobalSections(children: Paragraph[], persona: import('@/types/personas').GlobalPersona): void {
  if (persona.needs && persona.needs.length > 0) {
    children.push(...createStructuredSection("Needs", persona.needs));
  }
  
  if (persona.motivations && persona.motivations.length > 0) {
    children.push(...createBulletSection("Motivations", persona.motivations));
  }
  
  if (persona.keyResponsibilities && persona.keyResponsibilities.length > 0) {
    children.push(...createStructuredSection("Key Responsibilities", persona.keyResponsibilities));
  }
  
  if (persona.knowledgeOrExpertise && persona.knowledgeOrExpertise.length > 0) {
    children.push(...createBulletSection("Knowledge & Expertise", persona.knowledgeOrExpertise));
  }
  
  if (persona.typicalChallenges && persona.typicalChallenges.length > 0) {
    children.push(...createBulletSection("Typical Challenges", persona.typicalChallenges));
  }
  
  if (persona.behaviors && persona.behaviors.length > 0) {
    children.push(...createBulletSection("Behaviors", persona.behaviors));
  }
  
  if (persona.collaborationInsights && persona.collaborationInsights.length > 0) {
    children.push(...createBulletSection("Collaboration Insights", persona.collaborationInsights));
  }
}

/**
 * Add sections for country personas
 */
function addCountrySections(children: Paragraph[], persona: import('@/types/personas').CountryPersona): void {
  if (persona.needs && Object.keys(persona.needs).length > 0) {
    children.push(...createRecordSection("Needs", persona.needs));
  }
  
  if (persona.motivations && Object.keys(persona.motivations).length > 0) {
    children.push(...createRecordSection("Motivations", persona.motivations));
  }
  
  if (persona.painPoints && Object.keys(persona.painPoints).length > 0) {
    children.push(...createRecordSection("Pain Points", persona.painPoints));
  }
  
  if (persona.behaviors && Object.keys(persona.behaviors).length > 0) {
    children.push(...createRecordSection("Behaviors", persona.behaviors));
  }
  
  if (persona.keyResponsibilities && Object.keys(persona.keyResponsibilities).length > 0) {
    children.push(...createRecordSection("Key Responsibilities", persona.keyResponsibilities));
  }
  
  if (persona.collaborationInsights && Object.keys(persona.collaborationInsights).length > 0) {
    children.push(...createRecordSection("Collaboration Insights", persona.collaborationInsights));
  }
  
  if (persona.regionalNuances && Object.keys(persona.regionalNuances).length > 0) {
    children.push(...createSimpleRecordSection("Regional Nuances", persona.regionalNuances));
  }
  
  if (persona.culturalContext) {
    children.push(...createSimpleSection("Cultural Context", persona.culturalContext));
  }
}

/**
 * Create a bullet point section with title and items
 */
function createBulletSection(title: string, items: string[]): Paragraph[] {
  if (!items || items.length === 0) return [];
  
  return [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
    ...items.map(item => new Paragraph({
      text: item,
      bullet: {
        level: 0,
      },
      spacing: {
        after: 200,
      },
    })),
  ];
}

/**
 * Create a simple text section
 */
function createSimpleSection(title: string, content: string): Paragraph[] {
  return [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
    new Paragraph({
      text: content,
      spacing: {
        after: 400,
      },
    }),
  ];
}

/**
 * Create a structured section for items with Category and Description
 */
function createStructuredSection(title: string, items: Array<{ Category: string; Description: string }>): Paragraph[] {
  if (!items || items.length === 0) return [];
  
  return [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
    ...items.map(item => new Paragraph({
      text: `${item.Category}: ${item.Description}`,
      bullet: {
        level: 0,
      },
      spacing: {
        after: 200,
      },
    })),
  ];
}

/**
 * Create a section for Record<string, string> data
 */
function createSimpleRecordSection(title: string, record: Record<string, string>): Paragraph[] {
  if (!record || Object.keys(record).length === 0) return [];
  
  const paragraphs = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
  ];
  
  Object.entries(record).forEach(([category, content]) => {
    paragraphs.push(new Paragraph({
      text: category.replace(/_/g, ' '),
      heading: HeadingLevel.HEADING_3,
      spacing: {
        before: 200,
        after: 100,
      },
    }));
    
    paragraphs.push(new Paragraph({
      text: content,
      spacing: {
        after: 200,
      },
    }));
  });
  
  return paragraphs;
}

/**
 * Create a section for Record<string, string[]> data
 */
function createRecordSection(title: string, record: Record<string, string[]>): Paragraph[] {
  if (!record || Object.keys(record).length === 0) return [];
  
  const paragraphs = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
  ];
  
  Object.entries(record).forEach(([category, items]) => {
    paragraphs.push(new Paragraph({
      text: category.replace(/_/g, ' '),
      heading: HeadingLevel.HEADING_3,
      spacing: {
        before: 200,
        after: 100,
      },
    }));
    
    if (Array.isArray(items)) {
      items.forEach(item => {
        paragraphs.push(new Paragraph({
          text: item,
          bullet: {
            level: 0,
          },
          spacing: {
            after: 100,
          },
        }));
      });
    }
  });
  
  return paragraphs;
}

/**
 * Create connection opportunities section
 */
function createConnectionOpportunitiesSection(items: Array<{ Area: string; Finding: string; Leverage_Point: string }>): Paragraph[] {
  if (!items || items.length === 0) return [];
  
  return [
    new Paragraph({
      text: "Connection Opportunities",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
    ...items.map(item => new Paragraph({
      text: `${item.Area}: ${item.Finding} - ${item.Leverage_Point}`,
      bullet: {
        level: 0,
      },
      spacing: {
        after: 200,
      },
    })),
  ];
}

/**
 * Create perception gaps section
 */
function createPerceptionGapsSection(items: Array<{ Area: string; Gap: string; Business_Impact: string; Opportunity: string }>): Paragraph[] {
  if (!items || items.length === 0) return [];
  
  return [
    new Paragraph({
      text: "Perception Gaps",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
    ...items.map(item => new Paragraph({
      text: `${item.Area}: ${item.Gap} (Impact: ${item.Business_Impact}, Opportunity: ${item.Opportunity})`,
      bullet: {
        level: 0,
      },
      spacing: {
        after: 200,
      },
    })),
  ];
}

/**
 * Create emotional triggers section for v3
 */
function createEmotionalTriggersV3Section(items: Array<{ Trigger: string; Emotional_Response: string; Messaging_Implication: string }>): Paragraph[] {
  if (!items || items.length === 0) return [];
  
  return [
    new Paragraph({
      text: "Emotional Triggers",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
    ...items.map(item => new Paragraph({
      text: `${item.Trigger}: ${item.Emotional_Response} - ${item.Messaging_Implication}`,
      bullet: {
        level: 0,
      },
      spacing: {
        after: 200,
      },
    })),
  ];
}

/**
 * Create reference sources section
 */
function createReferenceSourcesSection(sources: Array<{ Category: string; Sources: string[]; URLs?: string[] }>): Paragraph[] {
  if (!sources || sources.length === 0) return [];
  
  const paragraphs = [
    new Paragraph({
      text: "Reference Sources",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
    }),
  ];
  
  sources.forEach(source => {
    paragraphs.push(new Paragraph({
      text: source.Category,
      heading: HeadingLevel.HEADING_3,
      spacing: {
        before: 200,
        after: 100,
      },
    }));
    
    source.Sources.forEach(item => {
      paragraphs.push(new Paragraph({
        text: item,
        bullet: {
          level: 0,
        },
        spacing: {
          after: 100,
        },
      }));
    });
  });
  
  return paragraphs;
} 
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Persona, isGlobalPersona, isCountryPersona } from '@/types/personas';

/**
 * Generates a Word document for a Persona and initiates download
 * @param persona The persona data to include in the document
 */
export async function generatePersonaDocument(persona: Persona) {
  try {
    console.log("Starting document generation for:", persona.title);
    
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
        text: isGlobalPersona(persona) ? persona.goalStatement : persona.userGoalStatement,
        spacing: {
          after: 400,
        },
      }),
    ];
    
    // Add sections based on persona type
    if (isGlobalPersona(persona)) {
      // Add global persona specific sections
      if (persona.needs && persona.needs.length > 0) {
        children.push(...createBulletSection("Needs", persona.needs));
      }
      
      if (persona.motivations && persona.motivations.length > 0) {
        children.push(...createBulletSection("Motivations", persona.motivations));
      }
      
      if (persona.keyResponsibilities && persona.keyResponsibilities.length > 0) {
        children.push(...createBulletSection("Key Responsibilities", persona.keyResponsibilities));
      }
      
      if (persona.knowledgeOrExpertise && persona.knowledgeOrExpertise.length > 0) {
        children.push(...createBulletSection("Knowledge & Expertise", persona.knowledgeOrExpertise));
      }
      
      if (persona.typicalChallenges && persona.typicalChallenges.length > 0) {
        children.push(...createBulletSection("Typical Challenges", persona.typicalChallenges));
      }
    } else if (isCountryPersona(persona)) {
      // Add country persona specific sections
      if (persona.needs && persona.needs.length > 0) {
        children.push(...createBulletSection("Needs", persona.needs));
      }
      
      if (persona.motivations && persona.motivations.length > 0) {
        children.push(...createBulletSection("Motivations", persona.motivations));
      }
      
      if (persona.painPoints && persona.painPoints.length > 0) {
        children.push(...createBulletSection("Pain Points", persona.painPoints));
      }
      
      if (persona.behaviors && persona.behaviors.length > 0) {
        children.push(...createBulletSection("Behaviors", persona.behaviors));
      }
      
      if (persona.keyResponsibilities && persona.keyResponsibilities.length > 0) {
        children.push(...createBulletSection("Key Responsibilities", persona.keyResponsibilities));
      }
      
      if (persona.collaborationInsights && persona.collaborationInsights.length > 0) {
        children.push(...createBulletSection("Collaboration Insights", persona.collaborationInsights));
      }
      
      if (persona.regionalNuances && persona.regionalNuances.length > 0) {
        children.push(...createBulletSection("Regional Nuances", persona.regionalNuances));
      }
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
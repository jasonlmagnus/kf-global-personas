import { PersonaData } from '../types/persona';

export function generateMockPersona(
  type: 'advanced' | 'simple',
  content: string,
  region: string,
  department: string
): PersonaData {
  // In a real implementation, this would be an API call to your AI service
  // For demo purposes, we'll generate a realistic persona based on the inputs
  
  const personaId = Math.random().toString(36).substr(2, 9);
  
  // Generate persona name based on department and type
  const personaNames = {
    ceo: ['Executive Leader Emma', 'Strategic Visionary Victor', 'C-Suite Champion Catherine'],
    chro: ['HR Leader Hannah', 'People-First Patricia', 'Culture Builder Carlos'],
    marketing: ['Digital Marketing Manager Maya', 'Brand Builder Brandon', 'Content Strategist Sarah'],
    sales: ['Sales Leader Samuel', 'Revenue Driver Rachel', 'Client Champion Chris'],
    it: ['Tech Leader Thomas', 'Innovation Catalyst Isabella', 'Systems Strategist Steve'],
    finance: ['Financial Analyst Fiona', 'Budget Builder Ben', 'Numbers Navigator Nancy'],
  };
  
  const departmentKey = department.toLowerCase() as keyof typeof personaNames;
  const names = personaNames[departmentKey] || personaNames.marketing;
  const name = names[Math.floor(Math.random() * names.length)];

  // Generate different content based on type and department
  const getPersonaContent = () => {
    if (type === 'advanced') {
      return {
        demographics: {
          age: '35-45',
          gender: 'Mixed',
          location: region === 'global' ? 'Global' : region.toUpperCase(),
          income: '$80K-150K',
          education: 'Bachelor\'s degree or higher'
        },
        psychographics: {
          values: ['Innovation', 'Efficiency', 'Growth', 'Quality'],
          interests: ['Technology', 'Professional development', 'Industry trends', 'Networking'],
          lifestyle: 'Professional, busy, tech-savvy, values work-life balance',
          personality: 'Analytical, strategic, results-driven, collaborative'
        },
        goals: {
          primary: 'Drive organizational success through strategic decision-making and team leadership',
          secondary: [
            'Stay ahead of industry trends and innovations',
            'Build high-performing teams',
            'Optimize operational efficiency',
            'Develop sustainable growth strategies'
          ]
        },
        painPoints: [
          'Limited time to evaluate all available solutions',
          'Balancing immediate needs with long-term strategy',
          'Managing cross-functional team coordination',
          'Keeping up with rapidly changing market conditions'
        ],
        behaviors: [
          'Researches solutions thoroughly before making decisions',
          'Consults with team members and stakeholders',
          'Prioritizes ROI and measurable outcomes',
          'Values clear communication and transparency',
          'Seeks continuous improvement opportunities'
        ],
        channels: {
          preferred: ['LinkedIn', 'Industry publications', 'Professional networks', 'Email'],
          usage: {
            'LinkedIn': 'Daily for industry news and networking',
            'Email': 'Primary communication channel',
            'Industry Reports': 'Weekly for market insights',
            'Webinars': 'Monthly for professional development'
          }
        },
        quote: 'I need solutions that not only solve today\'s problems but position us for tomorrow\'s opportunities.'
      };
    } else {
      return {
        demographics: {
          age: '28-38',
          gender: 'Mixed',
          location: region.toUpperCase(),
          income: '$50K-100K',
          education: 'Bachelor\'s degree'
        },
        psychographics: {
          values: ['Efficiency', 'Collaboration', 'Learning', 'Results'],
          interests: ['Local market trends', 'Team development', 'Process optimization'],
          lifestyle: 'Focused on regional execution, collaborative, detail-oriented',
          personality: 'Practical, team-oriented, adaptable, goal-focused'
        },
        goals: {
          primary: 'Successfully implement global strategies at the regional level',
          secondary: [
            'Understand local market nuances',
            'Build strong regional team relationships',
            'Deliver consistent results aligned with global objectives'
          ]
        },
        painPoints: [
          'Adapting global strategies to local market conditions',
          'Limited resources compared to global headquarters',
          'Balancing global consistency with local relevance'
        ],
        behaviors: [
          'Looks for proven solutions that work at scale',
          'Values training and support resources',
          'Prefers clear implementation guidelines',
          'Focuses on practical, actionable insights'
        ],
        channels: {
          preferred: ['Email', 'Team meetings', 'Regional networks', 'Training platforms'],
          usage: {
            'Email': 'Primary communication for updates',
            'Team Meetings': 'Weekly for coordination',
            'Training Materials': 'As needed for skill development',
            'Regional Forums': 'Monthly for local insights'
          }
        },
        quote: 'Give me clear guidance and the right tools, and I\'ll deliver results that make the global team proud.'
      };
    }
  };

  const personaContent = getPersonaContent();

  return {
    id: personaId,
    name,
    type,
    region,
    department,
    ...personaContent,
    createdAt: new Date().toISOString(),
    sourceContent: content,
  };
}
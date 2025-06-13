export interface PersonaData {
  id: string;
  name: string;
  type: 'advanced' | 'simple';
  region: string;
  department: string;
  demographics: {
    age: string;
    gender: string;
    location: string;
    income: string;
    education: string;
  };
  psychographics: {
    values: string[];
    interests: string[];
    lifestyle: string;
    personality: string;
  };
  goals: {
    primary: string;
    secondary: string[];
  };
  painPoints: string[];
  channels: {
    preferred: string[];
    usage: Record<string, string>;
  };
  quote: string;
  behaviors: string[];
  createdAt: string;
  sourceContent: string;
}

export interface ProcessingMessage {
  id: number;
  message: string;
  completed: boolean;
}
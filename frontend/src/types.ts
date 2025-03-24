export type Framework = 'pydantic-ai' | 'openai-agents' | 'mastra-ai';

export interface TravelRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  preferences: {
    origin?: string;
    accommodationType?: string;
    activities?: string[];
    [key: string]: any;
  };
}

export interface ApiResponse {
  destination: string;
  dates: {
    start: string;
    end: string;
  };
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  transportation: any;
  accommodation: any;
  activities: any;
  summary: string;
  [key: string]: any;
}
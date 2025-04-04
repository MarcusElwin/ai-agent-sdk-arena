
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { 
  weatherAgent, 
  coordinatorAgent, 
  flightAgent, 
  accommodationAgent, 
  activitiesAgent 
} from './agents';

export const mastra = new Mastra({
  agents: { 
    weatherAgent,         // Keeping for backward compatibility
    coordinatorAgent,     // Main agent that orchestrates planning
    flightAgent,          // Specialized flight research agent
    accommodationAgent,   // Specialized accommodation research agent  
    activitiesAgent       // Specialized activities research agent
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  })
  // Memory configuration removed due to compatibility issue
});

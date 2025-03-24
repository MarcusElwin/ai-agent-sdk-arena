import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CoordinatorAgent } from './agents/coordinator';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', framework: 'mastra-ai' });
});

// Travel planning endpoint
app.post('/plan', async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, preferences = {} } = req.body;
    
    // Initialize the coordinator agent
    const coordinator = new CoordinatorAgent();
    
    // Process the request through the coordinator
    const result = await coordinator.planTrip({
      destination,
      startDate,
      endDate,
      budget,
      preferences
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

# AI Agent Framework Comparison - Travel Planner

This project aims to evaluate three AI agent frameworks for a travel planning system:

1. **Pydantic AI** (Python)
2. **OpenAI Agents SDK** (Python)
3. **Mastra AI** (TypeScript)

The application consists of a React frontend and three separate backend implementations, each using a different AI agent framework.

## Project Structure

```
/
├── frontend/               # React frontend
├── backend/
│   ├── pydantic-ai/        # Python backend using Pydantic AI
│   ├── openai-agents-py/   # Python backend using OpenAI Agents SDK
│   └── mastra-ai/          # TypeScript backend using Mastra AI
```

## Setup Instructions

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on http://localhost:3000

### Backend Setup

#### Pydantic AI (Python)

```bash
cd backend/pydantic-ai
poetry install
poetry run python server.py
```

The Pydantic AI backend will run on http://localhost:8000

#### OpenAI Agents SDK (Python)

```bash
cd backend/openai-agents-py
poetry install
poetry run python server.py
```

The OpenAI Agents SDK backend will run on http://localhost:8001

#### Mastra AI (TypeScript)

```bash
cd backend/mastra-ai
npm install
npm run dev
```

The Mastra AI backend will run on http://localhost:8002

## Environment Variables

Create a `.env` file in each backend directory with the appropriate API keys:

```
# For OpenAI-based backends
OPENAI_API_KEY=your_openai_key_here

# For Mastra AI
MASTRA_API_KEY=your_mastra_key_here
```

## System Architecture

The system consists of four main agents:

1. **Coordinator Agent** - Analyzes user requirements, delegates tasks, and synthesizes final itinerary
2. **Flight Research Agent** - Finds optimal flight options based on user constraints
3. **Accommodation Agent** - Researches hotels, Airbnbs, and other lodging options
4. **Activities Agent** - Discovers popular attractions, restaurants, and experiences

## Evaluation Criteria

- Code complexity and maintainability
- Development time
- Performance
- Features supported
- Ease of deployment

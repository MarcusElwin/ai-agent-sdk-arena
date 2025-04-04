# Pydantic AI Backend

This is the Pydantic AI backend for the AI Agent Arena project. It provides a travel planning agent system built with FastAPI and Pydantic.

## Features

- Travel planning agent system using Pydantic models
- Flight booking agent
- Accommodation booking agent
- Activities recommendation agent
- Coordinator agent for orchestrating the planning process

## Development

To run the server locally:

```bash
cd backend/pydantic-ai
poetry install
poetry run uvicorn app.main:app --reload
```

## API Endpoints

- `POST /plan`: Create a travel itinerary

## Architecture

The backend is organized around a multi-agent system where specialized agents handle different aspects of travel planning:

- `FlightAgent`: Handles flight search and booking recommendations
- `AccommodationAgent`: Recommends accommodation options
- `ActivitiesAgent`: Suggests activities based on destination
- `CoordinatorAgent`: Orchestrates the planning process and combines all recommendations

Each agent uses Pydantic models to ensure type safety and data validation throughout the system.

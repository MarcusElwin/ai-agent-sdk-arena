# OpenAI Agents Python Backend

This is the OpenAI Agents backend for the AI Agent Arena project. It provides a travel planning agent system built with FastAPI and OpenAI's Assistants API.

## Features

- Travel planning agent system using OpenAI's Assistants API
- Coordinator agent for orchestrating the planning process
- Comprehensive travel itinerary generation

## Development

To run the server locally:

```bash
cd backend/openai-agents-py
poetry install
poetry run uvicorn app.main:app --reload
```

## API Endpoints

- `POST /plan`: Create a travel itinerary

## Architecture

The backend is organized around a coordinator agent that uses OpenAI's Assistant API to create comprehensive travel plans. The system leverages OpenAI's capabilities to:

- Search and recommend flights
- Find suitable accommodations
- Suggest personalized activities
- Create a cohesive travel itinerary

The API is built with FastAPI for high performance and type safety.

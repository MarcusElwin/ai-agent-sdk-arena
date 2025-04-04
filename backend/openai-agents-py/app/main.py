import os
from typing import Any, Dict, List

import dotenv

# Import agent modules
from app.agents.coordinator import CoordinatorAgent
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
dotenv.load_dotenv()

app = FastAPI(title="Travel Planner - OpenAI Agents SDK")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "framework": "openai-agents-sdk"}


@app.post("/plan")
async def create_travel_plan(request: Dict[str, Any]):
    try:
        # Extract user requirements
        destination = request.get("destination")
        start_date = request.get("startDate")
        end_date = request.get("endDate")
        budget = request.get("budget")
        preferences = request.get("preferences", {})

        # Initialize the coordinator agent
        coordinator = CoordinatorAgent()

        # Process the request through the coordinator
        result = await coordinator.plan_trip(
            destination=destination,
            start_date=start_date,
            end_date=end_date,
            budget=budget,
            preferences=preferences,
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

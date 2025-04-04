from typing import Any, Dict, List


class CoordinatorAgent:
    """
    Coordinator Agent - Analyzes user requirements, delegates tasks, and synthesizes final itinerary
    """

    def __init__(self):
        # Initialize with other agents
        from app.agents.accommodation import AccommodationAgent
        from app.agents.activities import ActivitiesAgent
        from app.agents.flight import FlightResearchAgent

        self.flight_agent = FlightResearchAgent()
        self.accommodation_agent = AccommodationAgent()
        self.activities_agent = ActivitiesAgent()

    async def plan_trip(
        self,
        destination: str,
        start_date: str,
        end_date: str,
        budget: float,
        preferences: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Orchestrates the travel planning process by delegating tasks to specialized agents
        and synthesizing their results into a comprehensive itinerary.
        """
        # Get flight options
        flight_results = await self.flight_agent.search_flights(
            origin=preferences.get("origin", "New York"),
            destination=destination,
            departure_date=start_date,
            return_date=end_date,
            budget=budget * 0.4,  # Allocate 40% of budget to flights
            preferences=preferences,
        )

        # Get accommodation options
        accommodation_results = await self.accommodation_agent.search_accommodations(
            destination=destination,
            check_in=start_date,
            check_out=end_date,
            budget=budget * 0.3,  # Allocate 30% of budget to accommodations
            preferences=preferences,
        )

        # Get activity options
        activities_results = await self.activities_agent.search_activities(
            destination=destination,
            start_date=start_date,
            end_date=end_date,
            budget=budget * 0.3,  # Allocate 30% of budget to activities
            preferences=preferences,
        )

        # Synthesize results into a comprehensive itinerary
        itinerary = {
            "destination": destination,
            "dates": {"start": start_date, "end": end_date},
            "budget": {
                "total": budget,
                "spent": sum(
                    [
                        flight_results.get("total_cost", 0),
                        accommodation_results.get("total_cost", 0),
                        activities_results.get("total_cost", 0),
                    ]
                ),
                "remaining": budget
                - sum(
                    [
                        flight_results.get("total_cost", 0),
                        accommodation_results.get("total_cost", 0),
                        activities_results.get("total_cost", 0),
                    ]
                ),
            },
            "transportation": flight_results,
            "accommodation": accommodation_results,
            "activities": activities_results,
            "summary": f"A {len(flight_results.get('days', [])) if 'days' in flight_results else 0}-day trip to {destination}",
        }

        return itinerary

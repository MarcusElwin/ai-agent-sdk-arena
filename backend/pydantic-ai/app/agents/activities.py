from typing import Dict, Any, List

class ActivitiesAgent:
    """
    Activities Agent - Discovers popular attractions, restaurants, and experiences
    """
    
    async def search_activities(self, destination: str, start_date: str, end_date: str, 
                              budget: float, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Searches for activities, attractions, and dining options based on user criteria and constraints.
        
        In a real implementation, this would call external activity APIs or use LLM to search and filter options.
        For this demo, we'll return mock data.
        """
        # Extract preferences for activities
        activity_preferences = preferences.get("activities", ["sightseeing", "dining"])
        
        # Mock implementation - in a real app would call activity search APIs
        activities = [
            {
                "name": f"{destination} Museum of Art",
                "category": "Attraction",
                "description": "World-renowned art museum featuring local and international exhibits",
                "location": f"Art District, {destination}",
                "price": budget * 0.05,
                "duration": "3 hours",
                "rating": 4.8,
                "images": ["museum_1.jpg", "museum_2.jpg"],
                "date": start_date
            },
            {
                "name": f"{destination} Culinary Tour",
                "category": "Food & Drink",
                "description": "Guided tour of local cuisine and food markets",
                "location": f"Downtown, {destination}",
                "price": budget * 0.1,
                "duration": "4 hours",
                "rating": 4.9,
                "images": ["food_tour_1.jpg", "food_tour_2.jpg"],
                "date": start_date
            },
            {
                "name": f"{destination} Harbor Cruise",
                "category": "Entertainment",
                "description": "Scenic boat tour of the harbor and coastline",
                "location": f"Harbor, {destination}",
                "price": budget * 0.07,
                "duration": "2 hours",
                "rating": 4.7,
                "images": ["cruise_1.jpg", "cruise_2.jpg"],
                "date": end_date
            }
        ]
        
        # Add dining options
        restaurants = [
            {
                "name": f"The {destination} Grill",
                "category": "Restaurant",
                "cuisine": "Local",
                "description": "Upscale dining featuring local specialties",
                "location": f"Downtown, {destination}",
                "price_range": "$$",
                "rating": 4.6,
                "images": ["restaurant_1.jpg", "restaurant_2.jpg"],
                "recommended_dishes": ["Local fish", "Regional stew"]
            },
            {
                "name": "Cafe Internationale",
                "category": "Restaurant",
                "cuisine": "International",
                "description": "Casual dining with dishes from around the world",
                "location": f"Tourist District, {destination}",
                "price_range": "$$",
                "rating": 4.5,
                "images": ["cafe_1.jpg", "cafe_2.jpg"],
                "recommended_dishes": ["Pasta", "Steak"]
            }
        ]
        
        # Calculate total cost
        total_cost = sum([activity["price"] for activity in activities])
        
        return {
            "activities": activities,
            "dining": restaurants,
            "total_cost": total_cost,
            "notes": ["Activities selected based on preferences", "Restaurant reservations recommended"]
        }
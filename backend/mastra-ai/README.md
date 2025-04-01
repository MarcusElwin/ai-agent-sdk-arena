# Mastra AI - Travel Planning Agent

This project demonstrates a multi-agent travel planning system built with Mastra. The system uses a coordinator agent that orchestrates specialized agents for flight search, accommodation booking, and activity planning.

## Architecture

### Component Flow
```mermaid
flowchart TD
    User[User] --> |Travel Request| Coordinator[Coordinator Agent]
    
    Coordinator --> |Flight Search Tasks| FlightAgent[Flight Agent]
    Coordinator --> |Accommodation Tasks| AccommodationAgent[Accommodation Agent]
    Coordinator --> |Activities Tasks| ActivitiesAgent[Activities Agent]
    Coordinator --> |Weather Data| WeatherTool[Weather Tool]
    
    FlightAgent --> |Uses| FlightTool[Flight Search Tool]
    AccommodationAgent --> |Uses| AccommodationTool[Accommodation Search Tool]
    ActivitiesAgent --> |Uses| ActivitiesTool[Activities Search Tool]
    ActivitiesAgent --> |Uses| WeatherTool
    
    FlightAgent --> |Flight Results| Coordinator
    AccommodationAgent --> |Accommodation Results| Coordinator
    ActivitiesAgent --> |Activities Results| Coordinator
    
    Coordinator --> |Complete Itinerary| User
```

### Sequence Diagram
```mermaid
sequenceDiagram
    actor User
    participant Coordinator as Coordinator Agent
    participant FlightAgent as Flight Agent
    participant AccommodationAgent as Accommodation Agent
    participant ActivitiesAgent as Activities Agent
    participant FlightTool as Flight Search Tool
    participant AccommodationTool as Accommodation Search Tool
    participant ActivitiesTool as Activities Search Tool
    participant WeatherTool as Weather Tool
    
    User->>Coordinator: Send travel request (destination, dates, budget)
    
    Coordinator->>WeatherTool: Check destination weather
    WeatherTool-->>Coordinator: Return weather data
    
    par Flight Search
        Coordinator->>FlightAgent: Request flight options
        FlightAgent->>FlightTool: Search flights (origin, destination, dates)
        FlightTool-->>FlightAgent: Return flight options & prices
        FlightAgent-->>Coordinator: Return optimized flight selections
    and Accommodation Search
        Coordinator->>AccommodationAgent: Request accommodation options
        AccommodationAgent->>AccommodationTool: Search accommodations (location, dates, guests)
        AccommodationTool-->>AccommodationAgent: Return accommodation options
        AccommodationAgent-->>Coordinator: Return best accommodation matches
    and Activities Planning
        Coordinator->>ActivitiesAgent: Request activities & attractions
        ActivitiesAgent->>WeatherTool: Check weather conditions
        WeatherTool-->>ActivitiesAgent: Return weather data
        ActivitiesAgent->>ActivitiesTool: Search activities (location, dates, interests)
        ActivitiesTool-->>ActivitiesAgent: Return activities options
        ActivitiesAgent-->>Coordinator: Return curated activities itinerary
    end
    
    Coordinator->>Coordinator: Integrate all components & validate budget
    Coordinator->>User: Return complete travel itinerary
    
    User->>Coordinator: Ask follow-up question
    Coordinator->>Coordinator: Process question using existing data
    Coordinator->>User: Respond with specific information
```

## Agent Roles

### Coordinator Agent
- Main orchestration agent
- Delegates tasks to specialized agents
- Synthesizes final travel itinerary
- Ensures budget constraints are met
- Answers user follow-up questions

### Flight Agent
- Specialized in finding optimal flights
- Considers price, layovers, flight duration, airline quality
- Makes recommendations based on user preferences

### Accommodation Agent
- Finds ideal lodging options
- Considers location, amenities, ratings, value for money
- Specializes in hotel and accommodation recommendations

### Activities Agent
- Discovers popular attractions and experiences
- Creates daily itineraries with logical organization
- Balances must-see attractions with unique experiences
- Considers weather conditions for appropriate planning

## Tools

### Flight Search Tool
- Finds flight options based on origin, destination, and dates
- Returns flight details including prices, times, and airline information

### Accommodation Search Tool
- Searches for accommodation options based on location and requirements
- Returns details about hotels, apartments, and other lodging options

### Activities Search Tool
- Finds activities, attractions, and experiences at a destination
- Creates recommended daily itineraries

### Weather Tool
- Gets current weather for a location
- Helps plan weather-appropriate activities

## Usage

The Mastra AI system provides a conversational interface where users can describe their travel plans and receive comprehensive itineraries. The system can handle:

- Initial travel planning with minimal information
- Follow-up questions about specific aspects of the trip
- Budget constraints and preference adjustments
- Weather-aware activity recommendations

The output is a structured JSON itinerary containing all travel details along with a natural language summary.
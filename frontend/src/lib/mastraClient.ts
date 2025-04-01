import { MastraClient } from "@mastra/client-js";
import { ApiResponse, TravelRequest } from "../types";

export const mastraClient = new MastraClient({
  baseUrl: "http://localhost:4111", // Default Mastra development server port
});

export const planTripWithMastra = async (travelRequest: TravelRequest): Promise<ApiResponse> => {
  try {
    // Get a reference to the coordinator agent (or weather agent as fallback for backward compatibility)
    const agent = mastraClient.getAgent("coordinatorAgent") || mastraClient.getAgent("weatherAgent");
    
    // Create a prompt with instructions about the expected output format
    const prompt = `You are a travel planning assistant. Create a complete travel itinerary in JSON format.

TRAVEL REQUEST:
Destination: ${travelRequest.destination}
Dates: ${travelRequest.startDate} to ${travelRequest.endDate}
Budget: $${travelRequest.budget}
Origin: ${travelRequest.preferences.origin || "Not specified"}
Accommodation Type: ${travelRequest.preferences.accommodationType || "Not specified"}
Activities: ${travelRequest.preferences.activities?.join(", ") || "Not specified"}

RESPONSE FORMAT:
{
  "destination": "string",
  "dates": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "budget": {
    "total": number,
    "spent": number,
    "remaining": number
  },
  "transportation": {
    "outbound": {
      "airline": "string",
      "departure": "YYYY-MM-DD",
      "arrival": "YYYY-MM-DD",
      "origin": "string",
      "destination": "string"
    },
    "inbound": {}
  },
  "accommodation": {
    "name": "string",
    "address": "string",
    "checkIn": "YYYY-MM-DD",
    "checkOut": "YYYY-MM-DD"
  },
  "activities": {
    "activities": []
  },
  "summary": "string"
}

Please provide the response as valid JSON without any other text.`;
    
    // Generate a response with the travel request
    const response = await agent.generate({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });
    
    // Based on the example, response has a text property
    if (response && response.text) {
      try {
        // Try to parse as JSON first
        return JSON.parse(response.text);
      } catch (e) {
        console.warn("Failed to parse Mastra response as JSON:", e);
        console.log("Raw response:", response.text);
        
        // If not valid JSON, create a structured response
        const fallbackResponse: ApiResponse = {
          summary: response.text,
          destination: travelRequest.destination,
          dates: {
            start: travelRequest.startDate,
            end: travelRequest.endDate
          },
          budget: {
            total: travelRequest.budget,
            spent: Math.round(travelRequest.budget * 0.85), // Estimate 85% of budget used
            remaining: Math.round(travelRequest.budget * 0.15) // Estimate 15% remaining
          },
          transportation: {
            outbound: {
              airline: "Example Airlines",
              departure: travelRequest.startDate,
              arrival: travelRequest.startDate,
              origin: travelRequest.preferences.origin || "Unknown",
              destination: travelRequest.destination
            },
            inbound: {
              airline: "Example Airlines",
              departure: travelRequest.endDate,
              arrival: travelRequest.endDate,
              origin: travelRequest.destination,
              destination: travelRequest.preferences.origin || "Unknown"
            }
          },
          accommodation: {
            name: travelRequest.preferences.accommodationType || "Hotel",
            address: `Example address in ${travelRequest.destination}`,
            checkIn: travelRequest.startDate,
            checkOut: travelRequest.endDate
          },
          activities: {
            activities: travelRequest.preferences.activities?.map((activity: string) => ({
              name: activity,
              date: travelRequest.startDate,
              duration: "2 hours",
              cost: Math.round(travelRequest.budget * 0.1)
            })) || []
          }
        };
        return fallbackResponse;
      }
    }
    
    throw new Error("Unexpected response format from Mastra agent");
  } catch (error) {
    console.error("Error using Mastra client:", error);
    throw error;
  }
};


// Function for sending chat messages with streaming
export const sendChatMessageWithMastra = async (
  message: string, 
  itinerary: ApiResponse | null = null,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    // Get a reference to the coordinator agent (or weather agent as fallback)
    const agent = mastraClient.getAgent("coordinatorAgent") || mastraClient.getAgent("weatherAgent");
    
    // Add context about the itinerary if available
    let prompt = message;
    if (itinerary) {
      prompt = `${message}\n\nContext: I'm planning a trip to ${itinerary.destination} from ${itinerary.dates.start} to ${itinerary.dates.end} with a budget of $${itinerary.budget.total}.`;
    }
    
    // If no streaming callback is provided, use the regular generate method
    if (!onChunk) {
      const response = await agent.generate({
        messages: [{ role: "user", content: prompt }]
      });
      return response.text || "I'm sorry, I couldn't process your request.";
    }
    
    // Try different stream methods available in the API
    let fullResponse = "";
    
    try {
      // Use the stream method with proper message format and tracking options
      const stream = await agent.stream(
        { messages: [{ role: "user", content: prompt }] },
      );
      
      // Use textStream as shown in the docs
      for await (const chunk of stream.textStream) {
        fullResponse += chunk;
        onChunk(fullResponse);
      }
      
      return fullResponse || "I'm sorry, I couldn't process your request.";
    } catch (streamError) {
      console.warn("stream method failed, falling back to regular generate:", streamError);
      
      // Fall back to non-streaming generate if streaming fails
      const response = await agent.generate({
        messages: [{ role: "user", content: prompt }]
      });
      
      const finalResponse = response.text || "I'm sorry, I couldn't process your request.";
      onChunk(finalResponse);
      return finalResponse;
    }
  } catch (error) {
    console.error("Error sending chat message:", error);
    return "Sorry, there was an error processing your message. Please try again.";
  }
};

export default mastraClient;
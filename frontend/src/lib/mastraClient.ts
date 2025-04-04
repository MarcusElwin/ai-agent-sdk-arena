import { MastraClient } from '@mastra/client-js';
import { ApiResponse, TravelRequest } from '../types';
import { extractJsonFromText } from './utils';

// Initialize Mastra client with memory support
export const mastraClient = new MastraClient({
  baseUrl: 'http://localhost:4111', // Default Mastra development server port
});

export const planTripWithMastra = async (travelRequest: TravelRequest): Promise<ApiResponse> => {
  try {
    // Get a reference to the coordinator agent (or weather agent as fallback for backward compatibility)
    const agent =
      mastraClient.getAgent('coordinatorAgent') || mastraClient.getAgent('weatherAgent');

    // Create a prompt with instructions about the expected output format
    const prompt = `You are a travel planning assistant. Create a complete travel itinerary in JSON format.

You have access to conversation memory that contains previous interactions and any travel plans already created.
If asked to modify a previous plan, refer to the conversation history.

TRAVEL REQUEST:
Destination: ${travelRequest.destination}
Dates: ${travelRequest.startDate} to ${travelRequest.endDate}
Budget: $${travelRequest.budget}
Origin: ${travelRequest.preferences.origin || 'Not specified'}
Accommodation Type: ${travelRequest.preferences.accommodationType || 'Not specified'}
Activities: ${travelRequest.preferences.activities?.join(', ') || 'Not specified'}

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

    // Use a stable threadId for consistent memory across interactions (GitHub example pattern)
    // Get existing threadId or create new one
    const threadId = localStorage.getItem('mastra-trip-thread-id') || `trip-thread-${Date.now()}`;
    localStorage.setItem('mastra-trip-thread-id', threadId);

    // User identifier - stays consistent for the user
    const resourceId = localStorage.getItem('mastra-user-id') || `user-${Date.now()}`;
    localStorage.setItem('mastra-user-id', resourceId);

    console.log(
      `Using trip thread ID: ${threadId} and resource ID: ${resourceId} for memory persistence.`
    );

    // Use GitHub example pattern with threadId and resourceId
    const response = await agent.generate({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      threadId: threadId,
      resourceId: resourceId,
    });

    // Based on the example, response has a text property
    if (response && response.text) {
      try {
        // Try to use our improved JSON extractor
        const extractedJson = extractJsonFromText(response.text);
        if (extractedJson) {
          console.log('Successfully extracted JSON from response');
          return extractedJson;
        }

        // Direct parse attempt if extraction fails
        return JSON.parse(response.text);
      } catch (e) {
        console.warn('Failed to parse Mastra response as JSON:', e);
        console.log('Raw response:', response.text);

        // Try one more time with a simpler regex approach
        try {
          const jsonMatch = response.text.match(/\{[\s\S]*\}/);
          if (jsonMatch && jsonMatch[0]) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log('Extracted JSON with simple regex');
            return parsed;
          }
        } catch (regexError) {
          console.warn('Simple regex extraction failed:', regexError);
        }

        // If not valid JSON, create a structured response
        const fallbackResponse: ApiResponse = {
          summary: response.text,
          destination: travelRequest.destination,
          dates: {
            start: travelRequest.startDate,
            end: travelRequest.endDate,
          },
          budget: {
            total: travelRequest.budget,
            spent: Math.round(travelRequest.budget * 0.85), // Estimate 85% of budget used
            remaining: Math.round(travelRequest.budget * 0.15), // Estimate 15% remaining
          },
          transportation: {
            outbound: {
              airline: 'Example Airlines',
              departure: travelRequest.startDate,
              arrival: travelRequest.startDate,
              origin: travelRequest.preferences.origin || 'Unknown',
              destination: travelRequest.destination,
            },
            inbound: {
              airline: 'Example Airlines',
              departure: travelRequest.endDate,
              arrival: travelRequest.endDate,
              origin: travelRequest.destination,
              destination: travelRequest.preferences.origin || 'Unknown',
            },
          },
          accommodation: {
            name: travelRequest.preferences.accommodationType || 'Hotel',
            address: `Example address in ${travelRequest.destination}`,
            checkIn: travelRequest.startDate,
            checkOut: travelRequest.endDate,
          },
          activities: {
            activities:
              travelRequest.preferences.activities?.map((activity: string) => ({
                name: activity,
                date: travelRequest.startDate,
                duration: '2 hours',
                cost: Math.round(travelRequest.budget * 0.1),
              })) || [],
          },
        };
        return fallbackResponse;
      }
    }

    throw new Error('Unexpected response format from Mastra agent');
  } catch (error) {
    console.error('Error using Mastra client:', error);
    throw error;
  }
};

// Expose session reset function to window for ChatBox to use
if (typeof window !== 'undefined') {
  window._resetMastraSession = () => {
    console.log('Resetting Mastra conversation threads');

    // Get current thread ID before removing it
    const threadId = localStorage.getItem('mastra-thread-id');

    // Clear thread and messages
    localStorage.removeItem('mastra-thread-id');
    localStorage.removeItem('mastra-user-id');

    if (threadId) {
      localStorage.removeItem(`messages-${threadId}`);
    }

    // Also clear trip thread if it exists
    const tripThreadId = localStorage.getItem('mastra-trip-thread-id');
    if (tripThreadId) {
      localStorage.removeItem('mastra-trip-thread-id');
      localStorage.removeItem(`messages-${tripThreadId}`);
    }
  };
}

// Function for sending chat messages with streaming
export const sendChatMessageWithMastra = async (
  message: string,
  itinerary: ApiResponse | null = null,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    // Get a reference to the coordinator agent (or weather agent as fallback)
    const agent =
      mastraClient.getAgent('coordinatorAgent') || mastraClient.getAgent('weatherAgent');

    // Add context about the itinerary if available
    let prompt = message;
    if (itinerary) {
      prompt = `${message}\n\nContext: I'm planning a trip to ${itinerary.destination} from ${itinerary.dates.start} to ${itinerary.dates.end} with a budget of $${itinerary.budget.total}.

IMPORTANT: Before answering, look back at our conversation history in memory. You must reference specific details we've previously discussed.
If I've mentioned preferences, dates, or asked questions before, acknowledge them explicitly in your response.

Always begin your response with a brief summary of what you already know about my travel plans if we've discussed them previously. Be very specific about dates, destinations, and preferences that I have shared before.`;
    } else {
      prompt = `${message}\n\nIMPORTANT: Before answering, look back at our conversation history in memory. You must reference specific details we've previously discussed.
If I've mentioned preferences, dates, or asked questions before, acknowledge them explicitly in your response.

Always begin your response with a brief summary of what you already know about my travel plans if we've discussed them previously. Be very specific about dates, destinations, and preferences that I have shared before.`;
    }

    // Use a stable threadId for consistent memory across interactions (GitHub example pattern)
    // Get existing threadId or create new one
    const threadId = localStorage.getItem('mastra-thread-id') || `thread-${Date.now()}`;
    localStorage.setItem('mastra-thread-id', threadId);

    // User identifier - stays consistent for the user
    const resourceId = localStorage.getItem('mastra-user-id') || `user-${Date.now()}`;
    localStorage.setItem('mastra-user-id', resourceId);

    console.log(
      `Using thread ID: ${threadId} and resource ID: ${resourceId} for memory persistence.`
    );

    // If this is a new message in the conversation, add to localStorage history
    const messagesKey = `messages-${threadId}`;
    const existingMessages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
    if (message && message.trim()) {
      existingMessages.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(messagesKey, JSON.stringify(existingMessages));
    }

    // Context removed to match GitHub example

    // If no streaming callback is provided, use the regular generate method
    if (!onChunk) {
      // Include resourceId and threadId for memory as specified in docs
      const response = await agent.generate({
        messages: [{ role: 'user', content: prompt }],
        threadId: threadId,
        resourceId: resourceId,
      });
      return response.text || "I'm sorry, I couldn't process your request.";
    }

    // Try different stream methods available in the API
    let fullResponse = '';

    try {
      // Check if stream method is available
      if (typeof agent.stream !== 'function') {
        throw new Error("Agent doesn't have stream method");
      }

      // Use the stream method with proper message format and tracking options
      const stream = await agent.stream({
        messages: [{ role: 'user', content: prompt }],
        threadId: threadId,
        resourceId: resourceId,
      });

      // Safety check for stream existence
      if (!stream || !stream.textStream) {
        throw new Error('Stream or textStream not available');
      }

      // Use textStream as shown in the docs
      for await (const chunk of stream.textStream) {
        fullResponse += chunk;
        onChunk(fullResponse);
      }

      return fullResponse || "I'm sorry, I couldn't process your request.";
    } catch (streamError) {
      console.warn('stream method failed, falling back to regular generate:', streamError);

      // Fall back to non-streaming generate if streaming fails
      const response = await agent.generate({
        messages: [{ role: 'user', content: prompt }],
        threadId: threadId,
        resourceId: resourceId,
      });

      const finalResponse = response.text || "I'm sorry, I couldn't process your request.";
      onChunk(finalResponse);
      return finalResponse;
    }
  } catch (error) {
    console.error('Error sending chat message:', error);
    return 'Sorry, there was an error processing your message. Please try again.';
  }
};

export default mastraClient;

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts JSON from a markdown code block or regular text
 * @param text The text containing JSON data
 * @returns Parsed JSON object or null if no valid JSON found
 */
export function extractJsonFromText(text: string): any | null {
  try {
    // First try to find JSON in a code block
    const jsonRegex = /```(?:json)?\s*({[\s\S]*?})\s*```/;
    const match = text.match(jsonRegex);
    
    if (match && match[1]) {
      // Found JSON in a code block
      const jsonStr = match[1].trim();
      console.log("Found JSON in code block:", jsonStr.substring(0, 100) + "...");
      return JSON.parse(jsonStr);
    }
    
    // If no code block, try to find JSON directly in the text
    const directJsonRegex = /({[\s\S]*})/;
    const directMatch = text.match(directJsonRegex);
    
    if (directMatch && directMatch[1]) {
      const jsonStr = directMatch[1].trim();
      console.log("Found direct JSON:", jsonStr.substring(0, 100) + "...");
      return JSON.parse(jsonStr);
    }

    // No valid JSON found
    console.log("No valid JSON found in text");
    return null;
  } catch (error) {
    console.error("Error parsing JSON from text:", error);
    return null;
  }
}
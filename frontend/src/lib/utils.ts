import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts JSON from a markdown code block or regular text
 * @param text The text containing JSON data
 * @returns Parsed JSON object or null if no valid JSON found
 */
export function extractJsonFromText(text: string): any | null {
  try {
    // First, check if the entire text is a valid JSON
    try {
      const trimmedText = text.trim();
      if (trimmedText.startsWith('{') && trimmedText.endsWith('}')) {
        const parsed = JSON.parse(trimmedText);
        console.log('Found valid JSON object in full text');
        return parsed;
      }
    } catch (e) {
      console.log('Full text is not valid JSON, trying other extraction methods');
    }

    // Next, try to find JSON in a code block
    const jsonRegex = /```(?:json)?\s*({[\s\S]*?})\s*```/;
    const match = text.match(jsonRegex);

    if (match && match[1]) {
      // Found JSON in a code block
      const jsonStr = match[1].trim();
      console.log('Found JSON in code block:', jsonStr.substring(0, 100) + '...');
      return JSON.parse(jsonStr);
    }

    // If no code block, try to find JSON directly in the text
    // Using a more robust regex that extracts the outermost JSON object
    const directJsonRegex = /({"[\s\S]*":[^{}]*})/;
    const directMatch = text.match(directJsonRegex);

    if (directMatch && directMatch[1]) {
      const jsonStr = directMatch[1].trim();
      console.log('Found direct JSON:', jsonStr.substring(0, 100) + '...');
      try {
        return JSON.parse(jsonStr);
      } catch (err) {
        console.warn(
          'Failed to parse extracted JSON, trying to extract the largest JSON-like structure'
        );
      }
    }

    // Last resort: find the largest curly-brace enclosed text
    // This is more aggressive and might capture invalid JSON, but we'll try to parse it
    const braceMatches = text.match(/({[\s\S]*?})/g);
    if (braceMatches) {
      // Sort by length and try the longest first
      braceMatches.sort((a, b) => b.length - a.length);

      for (const possibleJson of braceMatches) {
        try {
          const parsed = JSON.parse(possibleJson);
          if (parsed && typeof parsed === 'object') {
            console.log('Found JSON using brace matching:', possibleJson.substring(0, 100) + '...');
            return parsed;
          }
        } catch (err) {
          // Continue to next candidate
        }
      }
    }

    // No valid JSON found
    console.log('No valid JSON found in text');
    return null;
  } catch (error) {
    console.error('Error parsing JSON from text:', error);
    return null;
  }
}

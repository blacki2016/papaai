/**
 * Utility to parse JSON from AI responses
 * Handles cases where JSON is wrapped in markdown code blocks
 */
export const parseAIJson = (content: string): any => {
    if (!content) {
        throw new Error('Empty content provided to JSON parser');
    }

    // Remove markdown code blocks if present (```json ... ``` or ``` ... ```)
    let cleaned = content.trim();
    
    // Match and remove ```json ... ``` or ``` ... ```
    const codeBlockMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
    if (codeBlockMatch) {
        cleaned = codeBlockMatch[1].trim();
    }

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Failed to parse JSON:', error);
        console.error('Content was:', cleaned);
        throw new Error('Invalid JSON response from AI service');
    }
};

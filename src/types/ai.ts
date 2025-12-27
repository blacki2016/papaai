import { Recipe } from './recipe';

/**
 * Input types for AI service
 */
export type AIInputType = 'text' | 'image' | 'video';

/**
 * Source type for recipes
 */
export type AISourceType = 'text' | 'pantry' | 'ocr' | 'social';

/**
 * Input structure for AI service
 */
export interface AIInput {
    type: AIInputType;
    content: string; // Prompt text or URI
    mediaData?: string; // Optional Base64-encoded media data (for images)
    sourceType: AISourceType;
}

/**
 * Abstract interface for AI service providers
 * This allows switching between different AI providers (OpenAI, Gemini, etc.)
 */
export interface IAIService {
    /**
     * Generate a recipe from the given input
     * @param input - The input data containing type, content, and optional media
     * @returns Promise resolving to a Recipe object
     */
    generateRecipe(input: AIInput): Promise<Recipe>;
}

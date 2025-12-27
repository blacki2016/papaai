import { Recipe } from '../types/recipe';
import { AIInput, AISourceType } from '../types/ai';
import { createAIService } from './ai';

/**
 * Get the AI service instance
 * This is a singleton pattern to reuse the same provider instance
 */
let aiServiceInstance: ReturnType<typeof createAIService> | null = null;

const getAIService = () => {
    if (!aiServiceInstance) {
        aiServiceInstance = createAIService();
    }
    return aiServiceInstance;
};

/**
 * Generate a recipe from text input
 * Backward-compatible interface for existing code
 */
export const generateRecipe = async (
    input: string,
    sourceType: AISourceType = 'text'
): Promise<Recipe> => {
    const aiService = getAIService();
    
    const aiInput: AIInput = {
        type: 'text',
        content: input,
        sourceType,
    };

    return aiService.generateRecipe(aiInput);
};

/**
 * Generate a recipe from image input
 * New function for multimodal support
 */
export const generateRecipeFromImage = async (
    imageBase64: string,
    prompt: string,
    sourceType: AISourceType = 'ocr'
): Promise<Recipe> => {
    const aiService = getAIService();
    
    const aiInput: AIInput = {
        type: 'image',
        content: prompt,
        mediaData: imageBase64,
        sourceType,
    };

    return aiService.generateRecipe(aiInput);
};

/**
 * Generate a recipe from video input
 * New function for multimodal support
 */
export const generateRecipeFromVideo = async (
    videoUri: string,
    prompt: string,
    sourceType: AISourceType = 'social'
): Promise<Recipe> => {
    const aiService = getAIService();
    
    const aiInput: AIInput = {
        type: 'video',
        content: prompt,
        mediaData: videoUri,
        sourceType,
    };

    return aiService.generateRecipe(aiInput);
};

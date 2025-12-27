import { IAIService } from '../../types/ai';
import { GeminiProvider } from './GeminiProvider';
import { OpenAIProvider } from './OpenAIProvider';

/**
 * Factory function to create the appropriate AI service provider
 * By default, uses Gemini as it supports multimodal inputs
 * Falls back to OpenAI if Gemini key is not available
 */
export const createAIService = (): IAIService => {
    const geminiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    // Prefer Gemini for multimodal support
    if (geminiKey && geminiKey !== 'your-gemini-api-key-here') {
        try {
            return new GeminiProvider();
        } catch (error) {
            console.warn('Failed to initialize Gemini provider:', error);
        }
    }

    // Fallback to OpenAI
    if (openaiKey && openaiKey !== 'your-openai-api-key-here') {
        try {
            return new OpenAIProvider();
        } catch (error) {
            console.warn('Failed to initialize OpenAI provider:', error);
        }
    }

    throw new Error('No AI provider configured. Please set either EXPO_PUBLIC_GEMINI_API_KEY or EXPO_PUBLIC_OPENAI_API_KEY in your .env file.');
};

// Export providers for direct use if needed
export { GeminiProvider } from './GeminiProvider';
export { OpenAIProvider } from './OpenAIProvider';
export { parseAIJson } from './jsonParser';

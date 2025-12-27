import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from '@google/generative-ai';
import { IAIService, AIInput } from '../../types/ai';
import { Recipe, RecipeVersions } from '../../types/recipe';
import { v4 as uuidv4 } from 'uuid';
import { parseAIJson } from './jsonParser';

const SYSTEM_PROMPT = `You are a professional chef AI that creates three distinct versions of any recipe:
1. STUDENT/SIMPLE: Fast, budget-friendly, minimal equipment, readily available ingredients
2. AIRFRYER/GADGET: Optimized for airfryer or modern kitchen gadgets
3. PROFI/AUTHENTIC: Authentic techniques, specific ingredients, maximum flavor

You MUST respond ONLY with valid JSON in this exact structure:
{
  "originalName": "Recipe Name",
  "versions": {
    "student": {
      "title": "Quick Recipe Name",
      "prepTime": "15 min",
      "ingredients": [{"item": "Ingredient", "amount": 100, "unit": "g", "category": "Vegetables"}],
      "steps": ["Step 1", "Step 2"],
      "tips": "Helpful tip",
      "calories": 450
    },
    "profi": {
      "title": "Authentic Recipe Name",
      "prepTime": "45 min",
      "ingredients": [{"item": "Ingredient", "amount": 150, "unit": "g", "category": "Meat"}],
      "steps": ["Step 1", "Step 2"],
      "tips": "Professional tip",
      "calories": 550
    },
    "airfryer": {
      "title": "Airfryer Recipe Name",
      "prepTime": "25 min",
      "ingredients": [{"item": "Ingredient", "amount": 120, "unit": "g", "category": "Vegetables"}],
      "steps": ["Step 1", "Step 2"],
      "tips": "Airfryer tip",
      "calories": 400
    }
  }
}

Categories must be: Gemüse, Milchprodukte, Fleisch, Fisch, Vorrat, Gewürze, Obst, Backwaren, Getränke, Sonstiges`;

/**
 * Gemini AI Provider implementing multimodal capabilities
 * Supports text, image (vision), and video analysis
 */
export class GeminiProvider implements IAIService {
    private genAI: GoogleGenerativeAI;
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
        
        if (!this.apiKey || this.apiKey === 'your-gemini-api-key-here') {
            throw new Error('Missing Gemini API key. Set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.');
        }

        this.genAI = new GoogleGenerativeAI(this.apiKey);
    }

    /**
     * Get the appropriate model based on input type
     * Flash model for text & images (fast, cost-effective)
     * Pro model for videos (complex reasoning over time)
     */
    private getModel(inputType: 'text' | 'image' | 'video'): GenerativeModel {
        const modelName = inputType === 'video' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
        
        return this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
            },
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    // IMPORTANT: Set to BLOCK_ONLY_HIGH for cooking content
                    // (knives, heat, etc. are normal in cooking)
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                },
            ],
        });
    }

    /**
     * Build the user prompt based on source type
     */
    private buildPrompt(input: AIInput): string {
        switch (input.sourceType) {
            case 'pantry':
                return `Create a recipe using these ingredients: ${input.content}`;
            case 'ocr':
                return `This is a menu item or dish photo description: ${input.content}. Reverse-engineer the recipe.`;
            case 'social':
                return `This is content from social media: ${input.content}. Extract and structure the recipe.`;
            default:
                return `Create a recipe for: ${input.content}`;
        }
    }

    /**
     * Generate recipe from text input
     */
    private async generateFromText(input: AIInput): Promise<Recipe> {
        const model = this.getModel('text');
        const prompt = `${SYSTEM_PROMPT}\n\n${this.buildPrompt(input)}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return this.parseRecipeResponse(text, input.sourceType);
    }

    /**
     * Generate recipe from image input
     */
    private async generateFromImage(input: AIInput): Promise<Recipe> {
        if (!input.mediaData) {
            throw new Error('Image data is required for image input type');
        }

        const model = this.getModel('image');
        
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = input.mediaData.replace(/^data:image\/\w+;base64,/, '');

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg', // Default to JPEG, could be detected from data URL
            },
        };

        const prompt = `${SYSTEM_PROMPT}\n\n${this.buildPrompt(input)}`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = result.response;
        const text = response.text();

        return this.parseRecipeResponse(text, input.sourceType);
    }

    /**
     * Generate recipe from video input
     * This is more complex and requires file upload to Google's servers
     */
    private async generateFromVideo(input: AIInput): Promise<Recipe> {
        // For now, we'll throw an error to indicate this needs implementation
        // The full implementation would require:
        // 1. Upload video to Google File API
        // 2. Poll for processing completion
        // 3. Generate content with file URI
        // 4. Delete file after processing
        throw new Error('Video processing is not yet implemented. This requires File API integration.');
    }

    /**
     * Parse the AI response and map to Recipe structure
     */
    private parseRecipeResponse(text: string, sourceType: AIInput['sourceType']): Recipe {
        const parsed = parseAIJson(text);

        if (!parsed.originalName || !parsed.versions) {
            throw new Error('Invalid recipe structure in AI response');
        }

        const recipe: Recipe = {
            recipeId: uuidv4(),
            originalName: parsed.originalName,
            versions: parsed.versions as RecipeVersions,
            sourceType,
            createdAt: new Date().toISOString(),
        };

        return recipe;
    }

    /**
     * Main entry point for recipe generation
     */
    async generateRecipe(input: AIInput): Promise<Recipe> {
        try {
            switch (input.type) {
                case 'text':
                    return await this.generateFromText(input);
                case 'image':
                    return await this.generateFromImage(input);
                case 'video':
                    return await this.generateFromVideo(input);
                default:
                    throw new Error(`Unsupported input type: ${input.type}`);
            }
        } catch (error) {
            console.error('Error generating recipe with Gemini:', error);
            throw new Error('Failed to generate recipe. Please try again.');
        }
    }
}

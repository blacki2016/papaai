import OpenAI from 'openai';
import { IAIService, AIInput } from '../../types/ai';
import { Recipe, RecipeVersions } from '../../types/recipe';
import { v4 as uuidv4 } from 'uuid';

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
 * OpenAI Provider implementing IAIService
 * Legacy provider for backward compatibility
 */
export class OpenAIProvider implements IAIService {
    private openai: OpenAI;
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
        
        if (!this.apiKey || this.apiKey === 'your-openai-api-key-here') {
            throw new Error('Missing OpenAI API key. Set EXPO_PUBLIC_OPENAI_API_KEY in your .env file.');
        }

        this.openai = new OpenAI({
            apiKey: this.apiKey,
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
     * Generate recipe using OpenAI
     * Note: OpenAI doesn't support multimodal in the same way as Gemini
     * Images and videos would need different handling
     */
    async generateRecipe(input: AIInput): Promise<Recipe> {
        try {
            if (input.type !== 'text') {
                throw new Error('OpenAI provider currently only supports text input');
            }

            const userPrompt = this.buildPrompt(input);

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userPrompt }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response from OpenAI');
            }

            const parsed = JSON.parse(content);

            const recipe: Recipe = {
                recipeId: uuidv4(),
                originalName: parsed.originalName,
                versions: parsed.versions as RecipeVersions,
                sourceType: input.sourceType,
                createdAt: new Date().toISOString(),
            };

            return recipe;
        } catch (error) {
            console.error('Error generating recipe with OpenAI:', error);
            throw new Error('Failed to generate recipe. Please try again.');
        }
    }
}

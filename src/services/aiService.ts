import { Recipe, ImportSource } from '../types/recipe';

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
}

export class AIService {
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-1.5-pro';
    this.baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  /**
   * Generate three recipe versions from any import source
   */
  async generateRecipeVersions(source: ImportSource): Promise<Recipe> {
    const userPrompt = this.buildPrompt(source);
    
    const systemPrompt = `You are a professional chef assistant that creates three distinct versions of recipes:
1. Student/Simple: Optimized for speed, low budget, minimal equipment, and available ingredients.
2. Airfryer/Gadget: Optimized for airfryer or convenience devices.
3. Profi/Authentic: Focuses on authentic techniques, specific original ingredients, and intermediate steps for maximum taste.

Always respond with valid JSON matching this exact structure:
{
  "recipeId": "uuid",
  "originalName": "Recipe Name",
  "versions": {
    "student": {
      "title": "Quick Recipe Name",
      "prepTime": "15 min",
      "ingredients": [{"item": "Item", "amount": 100, "unit": "g"}],
      "steps": ["Step 1", "Step 2"],
      "tips": "Helpful tip"
    },
    "profi": {
      "title": "Authentic Recipe Name",
      "prepTime": "40 min",
      "ingredients": [{"item": "Item", "amount": 150, "unit": "g"}],
      "steps": ["Step 1", "Step 2"],
      "tips": "Helpful tip"
    },
    "airfryer": {
      "title": "Airfryer Recipe Name",
      "prepTime": "25 min",
      "ingredients": [{"item": "Item", "amount": 120, "unit": "g"}],
      "steps": ["Step 1", "Step 2"],
      "tips": "Helpful tip"
    }
  }
}

Respond ONLY with the JSON, no additional text.`;

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
    
    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.statusText} - ${errorData}`);
      }

      const data = await response.json();
      
      // Extract text from Gemini response structure
      const content = data.candidates[0].content.parts[0].text;
      
      // Clean up markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      // Parse the JSON response
      const recipe = JSON.parse(cleanContent);
      
      // Ensure recipeId is present
      if (!recipe.recipeId) {
        recipe.recipeId = this.generateUUID();
      }

      return recipe as Recipe;
    } catch (error) {
      console.error('Error generating recipe versions:', error);
      throw error;
    }
  }

  /**
   * Build prompt based on import source type
   */
  private buildPrompt(source: ImportSource): string {
    switch (source.type) {
      case 'text':
        return `Create three versions of this recipe: ${source.data}`;
      
      case 'pantry':
        const ingredients = Array.isArray(source.data) ? source.data.join(', ') : source.data;
        return `Suggest a recipe using these ingredients: ${ingredients}. Then create three versions of it.`;
      
      case 'ocr':
        return `This is a dish from a restaurant menu: ${source.data}. Reverse-engineer the recipe and create three versions.`;
      
      case 'social':
        return `This is content from a social media post: ${source.data}. Extract the recipe and create three versions.`;
      
      default:
        return `Create three versions of this recipe: ${source.data}`;
    }
  }

  /**
   * Generate a simple UUID
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

import type { IAIService, AIInput } from '../../types/ai';
import type { Recipe } from '../../types/recipe';
import { generateRecipe } from '../openaiService';

export class OpenAIProvider implements IAIService {
    async generateRecipe(input: AIInput): Promise<Recipe> {
        if (input.type !== 'text') {
            throw new Error('OpenAIProvider unterstützt in diesem Projekt nur Text.');
        }
        return await generateRecipe(input.content, 'text');
    }
}

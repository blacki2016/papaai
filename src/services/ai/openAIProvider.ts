import type { IAIService, AIInput } from '../../types/ai';
import type { Recipe } from '../../types/recipe';
import { generateRecipe } from '../openaiService';

export class OpenAIProvider implements IAIService {
    async generateRecipe(input: AIInput, onStatus: (status: string) => void): Promise<Recipe> {
        if (input.type !== 'text') {
            throw new Error('OpenAIProvider unterstützt in diesem Projekt nur Text.');
        }
        onStatus('Rezept wird erstellt...');
        return await generateRecipe(input.content, 'text');
    }
}

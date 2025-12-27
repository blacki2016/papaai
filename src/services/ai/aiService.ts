import type { IAIService } from '../../types/ai';
import { GeminiProvider } from './geminiProvider';

// Provider switch lives here (UI imports only this file).
export const aiService: IAIService = new GeminiProvider();

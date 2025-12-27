import type { Recipe } from './recipe';

export type AIInputType = 'text' | 'image' | 'video';

export interface AIInput {
    type: AIInputType;

    /**
     * For `text` and `image`: prompt/instructions.
     * For `video`: local file URI (expo-image-picker asset uri).
     */
    content: string;

    /** Optional base64 payload for images (without data: prefix). */
    mediaData?: string;

    /** Optional mime type hint for media. */
    mimeType?: string;

    /** Optional attribution used in the Recipe domain model. */
    sourceTypeHint?: Recipe['sourceType'];
}

export type AIStatusCallback = (status: string) => void;

export interface IAIService {
    generateRecipe(input: AIInput, onStatus?: AIStatusCallback): Promise<Recipe>;
}

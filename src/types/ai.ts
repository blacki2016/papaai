import type { Recipe } from './recipe';

type SourceHint = {
    /** Optional attribution used in the Recipe domain model. */
    sourceTypeHint?: Recipe['sourceType'];
};

export type AITextInput = SourceHint & {
    type: 'text';
    content: string;
};

export type AIImageInput = SourceHint & {
    type: 'image';
    mediaData: string;
    mimeType: string;
};

export type AIVideoInput = SourceHint & {
    type: 'video';
    /** Local file URI (expo-image-picker asset uri). */
    content: string;
};

export type AIInput = AITextInput | AIImageInput | AIVideoInput;

export type AIStatusCallback = (status: string) => void;

export interface IAIService {
    generateRecipe(input: AIInput, onStatus: AIStatusCallback): Promise<Recipe>;
}

import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
    SchemaType,
    type GenerationConfig,
} from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';

import type { IAIService, AIInput, AIStatusCallback } from '../../types/ai';
import type { Recipe, RecipeVersions } from '../../types/recipe';
import { extractJsonObjectFromText } from '../../utils/parseJson';
import { deleteGeminiFile, uploadFileToGemini, waitForGeminiFileActive } from './geminiFilesApi';

const getApiKey = () => {
    const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!key) throw new Error('Missing Gemini API key. Set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.');
    return key;
};

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const ingredientSchema = {
    type: SchemaType.OBJECT,
    properties: {
        item: { type: SchemaType.STRING },
        amount: { type: SchemaType.NUMBER },
        unit: { type: SchemaType.STRING },
        category: { type: SchemaType.STRING },
    },
    required: ['item', 'amount', 'unit'],
};

const versionSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: { type: SchemaType.STRING },
        prepTime: { type: SchemaType.STRING },
        ingredients: { type: SchemaType.ARRAY, items: ingredientSchema },
        steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        tips: { type: SchemaType.STRING },
        calories: { type: SchemaType.NUMBER },
    },
    required: ['title', 'prepTime', 'ingredients', 'steps', 'tips'],
};

const recipeResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        originalName: { type: SchemaType.STRING },
        versions: {
            type: SchemaType.OBJECT,
            properties: {
                student: versionSchema,
                profi: versionSchema,
                airfryer: versionSchema,
            },
            required: ['student', 'profi', 'airfryer'],
        },
    },
    required: ['originalName', 'versions'],
};

const baseGeneration: GenerationConfig = {
    temperature: 0.4,
    responseMimeType: 'application/json',
    // SDK typing for responseSchema is permissive in JS, stricter in TS; keep as any.
    responseSchema: recipeResponseSchema as any,
};

const SYSTEM =
    'Du bist ChefMate. Erstelle immer ein Rezept-Objekt mit 3 Varianten (student/profi/airfryer). ' +
    'Antworte ausschließlich mit JSON im vorgegebenen Schema. Kategorien: Gemüse, Milchprodukte, Fleisch, Fisch, Vorrat, Gewürze, Obst, Backwaren, Getränke, Sonstiges.';

export class GeminiProvider implements IAIService {
    private genAI = new GoogleGenerativeAI(getApiKey());

    private modelFlash = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: baseGeneration,
        safetySettings,
    });

    private modelPro = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        generationConfig: baseGeneration,
        safetySettings,
    });

    async generateRecipe(input: AIInput, onStatus?: AIStatusCallback): Promise<Recipe> {
        if (input.type === 'text') {
            onStatus?.('Rezept wird erstellt...');
            const result = await this.modelFlash.generateContent([SYSTEM, `Anfrage: ${input.content}`]);
            return this.mapToRecipe(result.response.text(), input.sourceTypeHint ?? 'text');
        }

        if (input.type === 'image') {
            if (!input.mediaData) {
                throw new Error('Für Bild-Requests wird mediaData (base64) benötigt.');
            }
            onStatus?.('Bild wird analysiert...');

            const mimeType = input.mimeType || 'image/jpeg';

            const parts: any[] = [
                { inlineData: { data: input.mediaData, mimeType } },
                SYSTEM,
                `Aufgabe: ${input.content}`,
            ];

            const result = await this.modelFlash.generateContent(parts);
            return this.mapToRecipe(result.response.text(), input.sourceTypeHint ?? 'ocr');
        }

        if (input.type === 'video') {
            // content = local URI
            onStatus?.('Video wird hochgeladen...');
            const uploaded = await uploadFileToGemini(input.content, 'chefmater-video');

            try {
                await waitForGeminiFileActive(uploaded.name, onStatus);
                onStatus?.('Analyse läuft...');

                const parts: any[] = [
                    { fileData: { fileUri: uploaded.uri, mimeType: uploaded.mimeType || 'video/mp4' } },
                    SYSTEM,
                    'Aufgabe: Analysiere dieses Kochvideo (Bild + Ton). Rekonstruiere das Rezept, Zutaten und Schritte. ' +
                    'Erzeuge 3 Varianten (student/profi/airfryer) und bleibe streng im JSON-Schema.',
                ];

                const result = await this.modelPro.generateContent(parts);
                return this.mapToRecipe(result.response.text(), input.sourceTypeHint ?? 'social');
            } finally {
                // Best-effort cleanup for privacy.
                try {
                    onStatus?.('Aufräumen...');
                    await deleteGeminiFile(uploaded.name);
                } catch {
                    // ignore cleanup errors
                }
            }
        }

        throw new Error('Unbekannter AIInput.type');
    }

    private mapToRecipe(text: string, sourceType: Recipe['sourceType']): Recipe {
        const jsonText = extractJsonObjectFromText(text);
        const parsed = JSON.parse(jsonText) as { originalName: string; versions: RecipeVersions };

        return {
            recipeId: uuidv4(),
            originalName: parsed.originalName,
            versions: parsed.versions,
            sourceType,
            createdAt: new Date().toISOString(),
        };
    }
}

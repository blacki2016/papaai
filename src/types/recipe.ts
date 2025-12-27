export interface Ingredient {
    item: string;
    amount: number;
    unit: string;
    category?: string;
}

export interface RecipeVersion {
    title: string;
    prepTime: string;
    ingredients: Ingredient[];
    steps: string[];
    tips: string;
    calories?: number;
}

export interface RecipeVersions {
    student: RecipeVersion;
    profi: RecipeVersion;
    airfryer: RecipeVersion;
}

export interface Recipe {
    recipeId: string;
    originalName: string;
    versions: RecipeVersions;
    sourceType?: 'text' | 'pantry' | 'ocr' | 'social';
    createdAt: string;
}

export type VersionType = 'student' | 'profi' | 'airfryer';

export interface PlannerSlot {
    recipeId: string;
    version: VersionType;
}

export interface PlannerDay {
    date: string;
    slots: {
        breakfast?: PlannerSlot;
        lunch?: PlannerSlot;
        dinner?: PlannerSlot;
    };
}

export interface ShoppingItem {
    item: string;
    amount: number;
    unit: string;
    category: string;
    checked: boolean;
    recipeIds: string[];
}

export type AppView = 'home' | 'planner' | 'shopping' | 'recipe-detail';

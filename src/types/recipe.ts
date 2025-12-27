export interface Ingredient {
  item: string;
  amount: number;
  unit: string;
}

export interface RecipeVersion {
  title: string;
  prepTime: string;
  ingredients: Ingredient[];
  steps: string[];
  tips: string;
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
}

export type RecipeVersionType = 'student' | 'profi' | 'airfryer';

export interface ImportSource {
  type: 'text' | 'pantry' | 'ocr' | 'social';
  data: string | string[];
}

export interface WeeklyPlan {
  [day: string]: Recipe[];
}

export interface ShoppingListItem {
  item: string;
  amount: number;
  unit: string;
  category: string;
}

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, WeeklyPlan, ShoppingListItem } from '../types/recipe';

interface AppState {
  recipes: Recipe[];
  weeklyPlan: WeeklyPlan;
  shoppingList: ShoppingListItem[];
  apiKey: string;
  
  // Recipe actions
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
  getRecipe: (recipeId: string) => Recipe | undefined;
  
  // Weekly plan actions
  addRecipeToDay: (day: string, recipe: Recipe) => void;
  removeRecipeFromDay: (day: string, recipeId: string) => void;
  
  // Shopping list actions
  updateShoppingList: () => void;
  clearShoppingList: () => void;
  
  // Settings actions
  setApiKey: (key: string) => void;
  
  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const STORAGE_KEYS = {
  RECIPES: '@chefmate_recipes',
  WEEKLY_PLAN: '@chefmate_weekly_plan',
  API_KEY: '@chefmate_api_key',
};

export const useAppStore = create<AppState>((set, get) => ({
  recipes: [],
  weeklyPlan: {},
  shoppingList: [],
  apiKey: '',

  // Recipe actions
  addRecipe: (recipe) => {
    set((state) => ({
      recipes: [...state.recipes, recipe],
    }));
    get().saveToStorage();
  },

  removeRecipe: (recipeId) => {
    set((state) => ({
      recipes: state.recipes.filter((r) => r.recipeId !== recipeId),
    }));
    get().saveToStorage();
  },

  getRecipe: (recipeId) => {
    return get().recipes.find((r) => r.recipeId === recipeId);
  },

  // Weekly plan actions
  addRecipeToDay: (day, recipe) => {
    set((state) => ({
      weeklyPlan: {
        ...state.weeklyPlan,
        [day]: [...(state.weeklyPlan[day] || []), recipe],
      },
    }));
    get().updateShoppingList();
    get().saveToStorage();
  },

  removeRecipeFromDay: (day, recipeId) => {
    set((state) => ({
      weeklyPlan: {
        ...state.weeklyPlan,
        [day]: (state.weeklyPlan[day] || []).filter((r) => r.recipeId !== recipeId),
      },
    }));
    get().updateShoppingList();
    get().saveToStorage();
  },

  // Shopping list actions
  updateShoppingList: () => {
    const { weeklyPlan } = get();
    const aggregatedItems: { [key: string]: ShoppingListItem } = {};

    // Iterate through all days and recipes
    Object.values(weeklyPlan).forEach((dayRecipes) => {
      dayRecipes.forEach((recipe) => {
        // For simplicity, we'll use the 'student' version ingredients
        // In a real app, you might want to let users choose which version
        recipe.versions.student.ingredients.forEach((ingredient) => {
          const key = `${ingredient.item}_${ingredient.unit}`;
          
          if (aggregatedItems[key]) {
            aggregatedItems[key].amount += ingredient.amount;
          } else {
            aggregatedItems[key] = {
              item: ingredient.item,
              amount: ingredient.amount,
              unit: ingredient.unit,
              category: categorizeIngredient(ingredient.item),
            };
          }
        });
      });
    });

    set({
      shoppingList: Object.values(aggregatedItems).sort((a, b) => 
        a.category.localeCompare(b.category)
      ),
    });
  },

  clearShoppingList: () => {
    set({ shoppingList: [] });
  },

  // Settings actions
  setApiKey: (key) => {
    set({ apiKey: key });
    get().saveToStorage();
  },

  // Persistence
  loadFromStorage: async () => {
    try {
      const [recipesData, weeklyPlanData, apiKeyData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.RECIPES),
        AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN),
        AsyncStorage.getItem(STORAGE_KEYS.API_KEY),
      ]);

      set({
        recipes: recipesData ? JSON.parse(recipesData) : [],
        weeklyPlan: weeklyPlanData ? JSON.parse(weeklyPlanData) : {},
        apiKey: apiKeyData || '',
      });

      // Update shopping list after loading
      get().updateShoppingList();
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const { recipes, weeklyPlan, apiKey } = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes)),
        AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(weeklyPlan)),
        AsyncStorage.setItem(STORAGE_KEYS.API_KEY, apiKey),
      ]);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
}));

/**
 * Simple ingredient categorization
 * In a real app, this could be more sophisticated
 */
function categorizeIngredient(item: string): string {
  const itemLower = item.toLowerCase();
  
  if (itemLower.includes('chicken') || itemLower.includes('beef') || 
      itemLower.includes('pork') || itemLower.includes('bacon') || 
      itemLower.includes('guanciale')) {
    return 'Meat';
  }
  
  if (itemLower.includes('tomato') || itemLower.includes('onion') || 
      itemLower.includes('garlic') || itemLower.includes('pepper')) {
    return 'Vegetables';
  }
  
  if (itemLower.includes('cheese') || itemLower.includes('cream') || 
      itemLower.includes('milk') || itemLower.includes('egg') ||
      itemLower.includes('pecorino')) {
    return 'Dairy';
  }
  
  if (itemLower.includes('pasta') || itemLower.includes('spaghetti') || 
      itemLower.includes('rice') || itemLower.includes('bread')) {
    return 'Grains';
  }
  
  return 'Other';
}

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, PlannerDay, ShoppingItem, VersionType } from '../types/recipe';

interface AppState {
    recipes: Recipe[];
    planner: PlannerDay[];
    shoppingList: ShoppingItem[];

    // Recipe actions
    addRecipe: (recipe: Recipe) => void;
    removeRecipe: (recipeId: string) => void;

    // Planner actions
    addToPlan: (dayIndex: number, slot: 'breakfast' | 'lunch' | 'dinner', recipeId: string, version: VersionType) => void;
    removeFromPlan: (dayIndex: number, slot: 'breakfast' | 'lunch' | 'dinner') => void;

    // Shopping list actions
    toggleShoppingItem: (index: number) => void;
    regenerateShoppingList: () => void;

    // Persistence
    loadData: () => Promise<void>;
    saveData: () => Promise<void>;
}

const initializePlanner = (): PlannerDay[] => {
    const days: PlannerDay[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push({
            date: date.toISOString().split('T')[0],
            slots: {}
        });
    }

    return days;
};

export const useAppStore = create<AppState>((set, get) => ({
    recipes: [],
    planner: initializePlanner(),
    shoppingList: [],

    addRecipe: (recipe) => {
        set((state) => ({
            recipes: [recipe, ...state.recipes]
        }));
        get().saveData();
    },

    removeRecipe: (recipeId) => {
        set((state) => ({
            recipes: state.recipes.filter(r => r.recipeId !== recipeId)
        }));
        get().saveData();
    },

    addToPlan: (dayIndex, slot, recipeId, version) => {
        set((state) => {
            const newPlanner = [...state.planner];
            newPlanner[dayIndex].slots[slot] = { recipeId, version };
            return { planner: newPlanner };
        });
        get().regenerateShoppingList();
        get().saveData();
    },

    removeFromPlan: (dayIndex, slot) => {
        set((state) => {
            const newPlanner = [...state.planner];
            delete newPlanner[dayIndex].slots[slot];
            return { planner: newPlanner };
        });
        get().regenerateShoppingList();
        get().saveData();
    },

    toggleShoppingItem: (index) => {
        set((state) => {
            const newList = [...state.shoppingList];
            newList[index].checked = !newList[index].checked;
            return { shoppingList: newList };
        });
        get().saveData();
    },

    regenerateShoppingList: () => {
        const { planner, recipes } = get();
        const aggregated = new Map<string, ShoppingItem>();

        planner.forEach((day) => {
            ['breakfast', 'lunch', 'dinner'].forEach((slot) => {
                const slotData = day.slots[slot as 'breakfast' | 'lunch' | 'dinner'];
                if (!slotData) return;

                const recipe = recipes.find(r => r.recipeId === slotData.recipeId);
                if (!recipe) return;

                const version = recipe.versions[slotData.version];
                version.ingredients.forEach((ing) => {
                    const key = `${ing.item.toLowerCase()}-${ing.unit}`;
                    const existing = aggregated.get(key);

                    if (existing) {
                        existing.amount += ing.amount;
                        existing.recipeIds.push(slotData.recipeId);
                    } else {
                        aggregated.set(key, {
                            item: ing.item,
                            amount: ing.amount,
                            unit: ing.unit,
                            category: ing.category || 'Sonstiges',
                            checked: false,
                            recipeIds: [slotData.recipeId]
                        });
                    }
                });
            });
        });

        set({ shoppingList: Array.from(aggregated.values()) });
        get().saveData();
    },

    loadData: async () => {
        try {
            const [recipesData, plannerData, shoppingData] = await Promise.all([
                AsyncStorage.getItem('recipes'),
                AsyncStorage.getItem('planner'),
                AsyncStorage.getItem('shoppingList')
            ]);

            set({
                recipes: recipesData ? JSON.parse(recipesData) : [],
                planner: plannerData ? JSON.parse(plannerData) : initializePlanner(),
                shoppingList: shoppingData ? JSON.parse(shoppingData) : []
            });
        } catch (error) {
            console.error('Error loading data:', error);
        }
    },

    saveData: async () => {
        try {
            const { recipes, planner, shoppingList } = get();
            await Promise.all([
                AsyncStorage.setItem('recipes', JSON.stringify(recipes)),
                AsyncStorage.setItem('planner', JSON.stringify(planner)),
                AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList))
            ]);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
}));

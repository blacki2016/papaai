# ChefMate Architecture Overview

## Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        ChefMate App                          │
│                   (React Native + Expo)                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────┐                          ┌──────────────┐
│ UI Layer      │                          │ Data Layer   │
│ (Screens)     │◄────────────────────────►│ (Store)      │
└───────────────┘                          └──────────────┘
        │                                           │
        │                                           │
        ▼                                           ▼
┌───────────────┐                          ┌──────────────┐
│ Navigation    │                          │ AsyncStorage │
│ (Stack)       │                          │ (Persist)    │
└───────────────┘                          └──────────────┘
                                                   │
                                                   ▼
                                          ┌──────────────┐
                                          │ AI Service   │
                                          │ (Google Gemini API) │
                                          └──────────────┘
```

## Screen Flow

```
                    ┌─────────────────┐
                    │   Home Screen   │
                    │   (Dashboard)   │
                    └────────┬────────┘
                             │
      ┌──────────────────────┼──────────────────────┐
      │                      │                      │
      ▼                      ▼                      ▼
┌──────────┐         ┌──────────────┐       ┌────────────┐
│  Import  │         │   My Data    │       │  Settings  │
│  Recipes │         │              │       │            │
└──────────┘         └──────────────┘       └────────────┘
      │                      │
      │                      │
┌─────┴──────┐         ┌─────┴──────┐
│            │         │            │
▼            ▼         ▼            ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ Text  │ │Pantry │ │Recipe │ │Weekly │
│Search │ │Input  │ │ List  │ │Planner│
└───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
    │         │         │         │
    │         │         │         │
┌───┴─────────┴─────────┴─────┐   │
│                              │   │
│    ┌───────┐  ┌──────────┐  │   │
│    │  OCR  │  │  Social  │  │   │
│    │ Scan  │  │  Import  │  │   │
│    └───┬───┘  └─────┬────┘  │   │
│        │            │        │   │
└────────┴────────────┴────────┘   │
         │            │            │
         └────────────┴────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Recipe Detail  │
         │   (3 Versions) │
         └────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ Shopping List  │
         │  (Aggregated)  │
         └────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User Input                                                  │
│  • Recipe name  • Ingredients  • Photo  • URL               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Import Screen       │
         │   (Validation)        │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   AI Service          │
         │   • Build prompt      │
         │   • Call Google Gemini API   │
         │   • Parse JSON        │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Recipe Object       │
         │   {                   │
         │     recipeId          │
         │     originalName      │
         │     versions: {       │
         │       student         │
         │       airfryer        │
         │       profi           │
         │     }                 │
         │   }                   │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Zustand Store       │
         │   • addRecipe()       │
         │   • Update state      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   AsyncStorage        │
         │   • Persist data      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   UI Update           │
         │   • Recipe Detail     │
         │   • Recipe List       │
         └───────────────────────┘
```

## Shopping List Aggregation

```
┌─────────────────────────────────────────────────────────────┐
│  Weekly Planner State                                        │
│  {                                                           │
│    Monday: [Recipe A, Recipe B]                             │
│    Tuesday: [Recipe C]                                      │
│    Wednesday: [Recipe A]                                    │
│  }                                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Extract Ingredients │
         │   From All Recipes    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Group by Item+Unit  │
         │   • Onions (pcs)      │
         │   • Tomatoes (g)      │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Sum Quantities      │
         │   • 2 + 1 + 1 = 4     │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Categorize          │
         │   • Meat              │
         │   • Vegetables        │
         │   • Dairy             │
         │   • Grains            │
         │   • Other             │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Sort by Category    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Display in UI       │
         │                       │
         │   Vegetables:         │
         │   □ 4 pcs Onions      │
         │   □ 200 g Tomatoes    │
         │                       │
         │   Dairy:              │
         │   □ 6 pcs Eggs        │
         └───────────────────────┘
```

## Component Structure

```
App.tsx
└── NavigationContainer
    └── Stack.Navigator
        ├── HomeScreen
        │   ├── Statistics
        │   ├── Import Options (4 cards)
        │   └── Quick Access (3 cards)
        │
        ├── Import Screens
        │   ├── TextSearchScreen
        │   │   ├── Text Input
        │   │   └── Generate Button → AIService
        │   ├── PantryInputScreen
        │   │   ├── Multi-line Input
        │   │   └── Generate Button → AIService
        │   ├── OCRScanScreen
        │   │   ├── Camera/Gallery Picker
        │   │   └── Process Button → AIService
        │   └── SocialImportScreen
        │       ├── URL Input
        │       └── Import Button → AIService
        │
        ├── RecipeDetailScreen
        │   ├── Version Selector (Student/Airfryer/Profi)
        │   ├── Ingredients List
        │   ├── Steps List
        │   └── Tips Box
        │
        ├── RecipeListScreen
        │   └── FlatList of Recipes
        │
        ├── WeeklyPlannerScreen
        │   ├── Day Cards (Mon-Sun)
        │   │   ├── Recipe Items
        │   │   └── Add Button → Modal
        │   └── Recipe Selection Modal
        │
        ├── ShoppingListScreen
        │   └── Categorized Ingredient Lists
        │
        └── SettingsScreen
            ├── API Key Input
            └── About Section
```

## State Management (Zustand)

```typescript
AppStore {
  // State
  recipes: Recipe[]
  weeklyPlan: WeeklyPlan
  shoppingList: ShoppingListItem[]
  apiKey: string

  // Recipe Actions
  addRecipe(recipe)
  removeRecipe(recipeId)
  getRecipe(recipeId)

  // Weekly Plan Actions
  addRecipeToDay(day, recipe)
  removeRecipeFromDay(day, recipeId)

  // Shopping List Actions
  updateShoppingList()      // ← Aggregation logic
  clearShoppingList()

  // Settings
  setApiKey(key)

  // Persistence
  loadFromStorage()
  saveToStorage()
}
```

## Key Algorithms

### Recipe Generation (AIService)
1. Receive import source (type + data)
2. Build context-specific prompt
3. Call Google Gemini API with system + user messages
4. Parse JSON response
5. Validate structure
6. Generate UUID if missing
7. Return Recipe object

### Shopping List Aggregation (appStore)
1. Iterate through weeklyPlan (all days)
2. Extract ingredients from each recipe
3. Create key: `item_unit` (e.g., "Onions_pcs")
4. Sum amounts for matching keys
5. Categorize each ingredient
6. Sort by category
7. Return aggregated list

### Ingredient Categorization
```
if (meat keywords) → "Meat"
if (vegetable keywords) → "Vegetables"
if (dairy keywords) → "Dairy"
if (grain keywords) → "Grains"
else → "Other"
```

## File Organization

```
papaai/
├── src/
│   ├── types/
│   │   └── recipe.ts              (Interfaces)
│   ├── services/
│   │   └── aiService.ts           (Google Gemini integration)
│   ├── store/
│   │   └── appStore.ts            (Zustand + AsyncStorage)
│   └── screens/
│       └── [10 screen components]
├── App.tsx                        (Navigation)
├── package.json                   (Dependencies)
├── tsconfig.json                  (TypeScript config)
└── [Documentation files]
```

## Technology Choices Rationale

| Technology | Why? |
|------------|------|
| **React Native + Expo** | Cross-platform, fast development, managed workflow |
| **TypeScript** | Type safety, better IDE support, fewer runtime errors |
| **Zustand** | Simple, lightweight, less boilerplate than Redux |
| **AsyncStorage** | Built-in, perfect for MVP, easy to upgrade to Supabase |
| **React Navigation** | Standard for RN, well-documented, flexible |
| **Google Gemini Gemini 1.5 Pro** | Best for structured output, recipe understanding |

## Future Enhancements

```
Phase 2:
  └── Cloud Sync (Supabase)
      ├── User Authentication
      ├── Recipe Sharing
      └── Cross-device Sync

Phase 3:
  └── Advanced Features
      ├── Nutritional Info
      ├── Voice Input
      ├── Barcode Scanner
      └── Cooking Timers

Phase 4:
  └── Integrations
      ├── Grocery Delivery APIs
      ├── Smart Kitchen Devices
      └── Social Features
```

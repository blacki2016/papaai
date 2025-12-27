# ChefMate - AI-Powered Adaptive Recipe App

An intelligent mobile application built with React Native and Expo that transforms any recipe input into three distinct versions optimized for different cooking scenarios.

## Features

### 🎯 Core Features

- **Tri-Level Recipe Engine**: Every recipe is automatically converted into three versions:
  - **Student/Simple**: Quick, budget-friendly, minimal equipment
  - **Airfryer/Gadget**: Optimized for convenience devices
  - **Profi/Authentic**: Restaurant-quality techniques and ingredients

### 📥 Multi-Source Import

1. **Text Search**: Enter any recipe name (e.g., "Carbonara", "Lasagne")
2. **Pantry Ingredients**: Input available ingredients to get recipe suggestions
3. **Restaurant Menu Scanner**: Take photos of menus to reverse-engineer recipes
4. **Social Media Import**: Import recipes from TikTok/Instagram URLs

### 📅 Meal Planning

- **Weekly Planner**: Organize meals for each day of the week
- **Smart Shopping List**: Automatically aggregates ingredients across all planned recipes
  - Combines quantities (e.g., 2 onions + 1 onion = 3 onions)
  - Groups items by category (Meat, Vegetables, Dairy, Grains, Other)

## Tech Stack

- **Framework**: React Native with Expo (Managed Workflow)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack Navigator)
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **AI Integration**: Google Gemini API
- **Image Handling**: Expo Image Picker & Camera

## Installation

1. Clone the repository:
```bash
git clone https://github.com/blacki2016/papaai.git
cd papaai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run android  # For Android
npm run ios      # For iOS (macOS only)
npm run web      # For web browser
```

## Configuration

### Google Gemini API Key

1. Open the app and navigate to **Settings**
2. Enter your Google Gemini API key (get one at https://aistudio.google.com/app/apikey)
3. The key is stored locally and securely on your device

**Important**: Using the Google Gemini API incurs costs. Monitor your usage and set billing limits.

## Usage Guide

### Importing a Recipe

1. **From Home Screen**, choose your import method:
   - **Text Search**: Type the recipe name → Generate
   - **Pantry**: Enter ingredients separated by commas → Generate
   - **Menu Scanner**: Take/upload photo → Process
   - **Social Media**: Paste TikTok/Instagram URL → Import

2. **View Recipe Versions**: Toggle between Student, Airfryer, and Profi versions

3. **Recipe is Auto-Saved**: Find it in "My Recipes"

### Planning Your Week

1. Go to **Weekly Planner**
2. Tap "Add Meal" on any day
3. Select a recipe from your saved collection
4. Repeat for other days

### Using the Shopping List

1. After planning your week, go to **Shopping List**
2. View aggregated ingredients organized by category
3. Ingredients are automatically combined (e.g., 2 + 1 onions = 3 onions)

## Data Structure

Recipes are stored in the following JSON format:

```json
{
  "recipeId": "uuid",
  "originalName": "Carbonara",
  "versions": {
    "student": {
      "title": "Quick Carbonara",
      "prepTime": "15 min",
      "ingredients": [
        {"item": "Bacon cubes", "amount": 100, "unit": "g"}
      ],
      "steps": ["Boil pasta", "Fry bacon", "Mix everything"],
      "tips": "Use cream to make it easier."
    },
    "profi": {
      "title": "Authentic Carbonara Romana",
      "prepTime": "40 min",
      "ingredients": [
        {"item": "Guanciale", "amount": 150, "unit": "g"}
      ],
      "steps": ["Render fat from Guanciale", ...],
      "tips": "Never use cream! Control heat to avoid scrambled eggs."
    },
    "airfryer": {
      // Airfryer-optimized version
    }
  }
}
```

## Project Structure

```
papaai/
├── src/
│   ├── types/
│   │   └── recipe.ts          # TypeScript interfaces
│   ├── services/
│   │   └── aiService.ts       # Google Gemini API integration
│   ├── store/
│   │   └── appStore.ts        # Zustand state management
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── TextSearchScreen.tsx
│   │   ├── PantryInputScreen.tsx
│   │   ├── OCRScanScreen.tsx
│   │   ├── SocialImportScreen.tsx
│   │   ├── RecipeDetailScreen.tsx
│   │   ├── RecipeListScreen.tsx
│   │   ├── WeeklyPlannerScreen.tsx
│   │   ├── ShoppingListScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── components/            # Reusable components (future)
├── App.tsx                    # Main app with navigation
└── package.json
```

## Future Enhancements

- [ ] Cloud sync with Supabase
- [ ] Recipe sharing between users
- [ ] Nutritional information
- [ ] Cooking timers and notifications
- [ ] Voice input for hands-free operation
- [ ] Barcode scanning for pantry management
- [ ] Integration with grocery delivery services
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

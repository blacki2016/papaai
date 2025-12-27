# ChefMate Quick Start Guide

Get up and running with ChefMate in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app (for testing on physical device) OR
- Android Studio / Xcode (for emulator)
- Google Gemini API key (get at https://aistudio.google.com/app/apikey)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/blacki2016/papaai.git
cd papaai

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

## First Time Setup

### Step 1: Start the App
After running `npm start`, you'll see a QR code in the terminal.

**Option A: Physical Device**
- Install Expo Go from App Store (iOS) or Play Store (Android)
- Scan the QR code with your camera (iOS) or Expo Go app (Android)

**Option B: Emulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Press `w` for web browser

### Step 2: Configure API Key
1. When the app opens, you'll see a warning: "Please set your Google Gemini API key"
2. Tap the warning OR navigate to Settings (gear icon)
3. Enter your Google Gemini API key (starts with `sk-`)
4. Tap "Save API Key"

### Step 3: Import Your First Recipe

#### Option 1: Text Search (Easiest)
1. From Home, tap "Text Search"
2. Type a recipe name, e.g., "Carbonara"
3. Tap "Generate Recipe"
4. Wait 10-30 seconds for AI to generate 3 versions
5. Browse Student/Airfryer/Profi versions

#### Option 2: From Ingredients
1. From Home, tap "Pantry Ingredients"
2. Enter ingredients separated by commas, e.g., "Eggs, Pasta, Bacon"
3. Tap "Generate Recipe"
4. AI suggests a recipe and creates 3 versions

#### Option 3: Photo Import
1. From Home, tap "Restaurant Menu"
2. Take a photo of a menu or dish OR choose from gallery
3. Tap "Process Image"
4. AI reverse-engineers the recipe

#### Option 4: Social Media
1. From Home, tap "Social Media"
2. Paste a TikTok or Instagram URL
3. Tap "Import Recipe"
4. AI extracts and generates 3 versions

## Using the Features

### View Your Recipes
1. Tap "My Recipes" from Home
2. Tap any recipe to view details
3. Toggle between Student 🎓, Airfryer 🍳, and Profi 👨‍🍳 versions

### Plan Your Week
1. Tap "Weekly Planner" from Home
2. For each day, tap "+ Add Meal"
3. Select a recipe from your saved recipes
4. Repeat for other days

### Generate Shopping List
1. After planning your week, tap "Shopping List"
2. View automatically aggregated ingredients
3. Ingredients are:
   - Combined by quantity (2 + 1 onions = 3 onions)
   - Grouped by category (Meat, Vegetables, Dairy, etc.)

## Tips & Tricks

### API Usage & Costs
- Each recipe generation costs approximately $0.05-0.15 (depending on complexity)
- Monitor your usage at aistudio.google.com/app/apikey
- Set up billing limits to control costs

### Recipe Quality
- More specific recipe names yield better results
  - ✅ "Italian Carbonara"
  - ❌ "Pasta"
- For pantry mode, provide 5-10 ingredients for best results
- OCR works best with clear, well-lit photos

### Storage
- All data is stored locally on your device
- Recipes persist between app restarts
- To start fresh, clear app data in device settings

### Version Selection
- **Student**: Best for quick weeknight dinners, tight budgets
- **Airfryer**: Best when you want convenience and healthier cooking
- **Profi**: Best for special occasions, when you have time and want authenticity

## Troubleshooting

### "Failed to generate recipe"
- Check your API key is correct (starts with `sk-`)
- Ensure you have internet connection
- Verify your Google Gemini account has credits
- Try simpler recipe names

### App crashes on start
```bash
# Clear the cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

### Camera not working
- Grant camera permissions in device settings
- On iOS: Settings → Privacy → Camera → Expo Go
- On Android: Settings → Apps → Expo Go → Permissions

### "No recipes available"
- Import at least one recipe before using Weekly Planner
- Recipes appear in "My Recipes" after successful import

## Example Workflow

**Scenario**: Plan a week of Italian meals

1. **Monday - Quick dinner**
   - Text Search: "Spaghetti Aglio e Olio"
   - Add Student version to Monday

2. **Tuesday - Using leftovers**
   - Pantry Input: "Leftover pasta, tomatoes, garlic, onion"
   - Add suggested recipe to Tuesday

3. **Wednesday - Healthy option**
   - Text Search: "Chicken Parmigiana"
   - Add Airfryer version to Wednesday

4. **Thursday - Restaurant quality**
   - Text Search: "Osso Buco"
   - Add Profi version to Thursday

5. **Generate Shopping List**
   - Tap Shopping List
   - All ingredients aggregated by category
   - Take this list to the store!

## Next Steps

- ⭐ Star the repo if you find it useful
- 🐛 Report bugs via GitHub Issues
- 💡 Suggest features via GitHub Discussions
- 🤝 Contribute via Pull Requests

## Support

- **Documentation**: See README.md, IMPLEMENTATION.md, EXAMPLES.md
- **Issues**: https://github.com/blacki2016/papaai/issues
- **Google Gemini Help**: https://aistudio.google.com/app/apikey/docs

---

**Happy Cooking with ChefMate! 🍳👨‍🍳**

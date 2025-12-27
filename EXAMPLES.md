# Example Recipe Data

This file shows example recipe data in the format used by ChefMate.

## Example 1: Carbonara (As specified in requirements)

```json
{
  "recipeId": "550e8400-e29b-41d4-a716-446655440000",
  "originalName": "Carbonara",
  "versions": {
    "student": {
      "title": "Quick Carbonara",
      "prepTime": "15 min",
      "ingredients": [
        {"item": "Bacon cubes", "amount": 100, "unit": "g"},
        {"item": "Cream", "amount": 200, "unit": "ml"},
        {"item": "Spaghetti", "amount": 500, "unit": "g"},
        {"item": "Parmesan", "amount": 50, "unit": "g"},
        {"item": "Eggs", "amount": 2, "unit": "pcs"}
      ],
      "steps": [
        "Boil pasta according to package instructions",
        "Fry bacon cubes until crispy",
        "Mix cream with eggs and grated parmesan",
        "Drain pasta and mix with bacon",
        "Add cream mixture and stir quickly",
        "Serve immediately with extra parmesan"
      ],
      "tips": "Use cream to make it easier and prevent scrambled eggs. Budget-friendly bacon works fine."
    },
    "profi": {
      "title": "Authentic Carbonara Romana",
      "prepTime": "40 min",
      "ingredients": [
        {"item": "Guanciale", "amount": 150, "unit": "g"},
        {"item": "Pecorino Romano", "amount": 100, "unit": "g"},
        {"item": "Egg Yolks", "amount": 4, "unit": "pcs"},
        {"item": "Spaghetti", "amount": 400, "unit": "g"},
        {"item": "Black Pepper", "amount": 2, "unit": "tsp"}
      ],
      "steps": [
        "Bring salted water to boil for pasta",
        "Dice guanciale into small cubes",
        "Render fat from guanciale slowly in a pan",
        "Cook spaghetti al dente, reserve 1 cup pasta water",
        "Mix egg yolks with grated pecorino and black pepper",
        "Remove pan from heat, add drained pasta",
        "Create emulsion by adding egg mixture off-heat",
        "Add pasta water gradually to achieve creamy consistency",
        "Plate immediately and top with crispy guanciale"
      ],
      "tips": "Never use cream! Control heat carefully to avoid scrambled eggs. The emulsion is created by pasta water and egg mixture. Use real Pecorino Romano, not parmesan."
    },
    "airfryer": {
      "title": "Airfryer Carbonara Bake",
      "prepTime": "25 min",
      "ingredients": [
        {"item": "Pre-cooked pasta", "amount": 400, "unit": "g"},
        {"item": "Bacon", "amount": 150, "unit": "g"},
        {"item": "Cream", "amount": 150, "unit": "ml"},
        {"item": "Eggs", "amount": 3, "unit": "pcs"},
        {"item": "Parmesan", "amount": 80, "unit": "g"},
        {"item": "Mozzarella", "amount": 50, "unit": "g"}
      ],
      "steps": [
        "Cut bacon into strips and airfry at 180°C for 8 minutes",
        "Mix cream, eggs, and grated parmesan",
        "Combine pre-cooked pasta with cream mixture and bacon",
        "Transfer to airfryer-safe dish",
        "Top with mozzarella",
        "Airfry at 160°C for 12-15 minutes until golden",
        "Let rest 3 minutes before serving"
      ],
      "tips": "Perfect for meal prep! You can prepare everything in advance and just airfry before serving. The mozzarella top adds a nice crispy layer."
    }
  }
}
```

## Example 2: Pad Thai

```json
{
  "recipeId": "660e8400-e29b-41d4-a716-446655440001",
  "originalName": "Pad Thai",
  "versions": {
    "student": {
      "title": "Easy Pad Thai",
      "prepTime": "20 min",
      "ingredients": [
        {"item": "Rice noodles", "amount": 200, "unit": "g"},
        {"item": "Chicken breast", "amount": 200, "unit": "g"},
        {"item": "Eggs", "amount": 2, "unit": "pcs"},
        {"item": "Soy sauce", "amount": 3, "unit": "tbsp"},
        {"item": "Peanut butter", "amount": 2, "unit": "tbsp"},
        {"item": "Vegetables mix", "amount": 200, "unit": "g"}
      ],
      "steps": [
        "Soak rice noodles in hot water for 10 minutes",
        "Cut chicken into bite-size pieces",
        "Fry chicken in oil until cooked",
        "Push chicken aside, scramble eggs",
        "Add drained noodles and vegetables",
        "Mix soy sauce with peanut butter and add to pan",
        "Stir fry everything for 3-4 minutes",
        "Serve with peanuts if available"
      ],
      "tips": "Using peanut butter instead of tamarind paste makes it simpler. Pre-cut vegetables save time."
    },
    "profi": {
      "title": "Authentic Pad Thai",
      "prepTime": "45 min",
      "ingredients": [
        {"item": "Rice noodles (Sen Lek)", "amount": 200, "unit": "g"},
        {"item": "Shrimp", "amount": 150, "unit": "g"},
        {"item": "Firm tofu", "amount": 100, "unit": "g"},
        {"item": "Tamarind paste", "amount": 3, "unit": "tbsp"},
        {"item": "Fish sauce", "amount": 2, "unit": "tbsp"},
        {"item": "Palm sugar", "amount": 2, "unit": "tbsp"},
        {"item": "Garlic", "amount": 3, "unit": "cloves"},
        {"item": "Dried shrimp", "amount": 2, "unit": "tbsp"},
        {"item": "Chinese chives", "amount": 50, "unit": "g"},
        {"item": "Bean sprouts", "amount": 100, "unit": "g"},
        {"item": "Roasted peanuts", "amount": 50, "unit": "g"},
        {"item": "Lime", "amount": 1, "unit": "pcs"}
      ],
      "steps": [
        "Soak noodles in room temperature water for 30 minutes",
        "Prepare sauce: mix tamarind paste, fish sauce, palm sugar",
        "Cube tofu and fry until golden, set aside",
        "Heat wok on high heat, add oil",
        "Fry minced garlic and dried shrimp briefly",
        "Add fresh shrimp, cook until pink",
        "Push to side, crack eggs and scramble",
        "Add drained noodles, pour sauce over",
        "Toss continuously, add tofu",
        "Add chives and half the bean sprouts",
        "Plate and garnish with remaining sprouts, peanuts, lime wedge"
      ],
      "tips": "High heat is crucial for authentic wok hei flavor. Don't overcook noodles - they should be slightly chewy. Balance sweet, sour, and salty flavors."
    },
    "airfryer": {
      "title": "Airfryer Pad Thai Cups",
      "prepTime": "30 min",
      "ingredients": [
        {"item": "Rice noodles", "amount": 200, "unit": "g"},
        {"item": "Cooked shrimp", "amount": 150, "unit": "g"},
        {"item": "Eggs", "amount": 3, "unit": "pcs"},
        {"item": "Pad Thai sauce", "amount": 100, "unit": "ml"},
        {"item": "Vegetables", "amount": 150, "unit": "g"},
        {"item": "Wonton wrappers", "amount": 12, "unit": "pcs"}
      ],
      "steps": [
        "Cook noodles according to package",
        "Press wonton wrappers into muffin-safe cups",
        "Airfry wrappers at 180°C for 5 minutes until crispy",
        "Mix noodles with sauce, shrimp, and vegetables",
        "Beat eggs and pour into another airfryer-safe dish",
        "Airfry eggs at 160°C for 8 minutes (like a frittata)",
        "Cut egg into pieces",
        "Fill crispy cups with noodle mixture",
        "Top with egg pieces and peanuts"
      ],
      "tips": "Great for parties or meal prep! The wonton cups add a fun crunch and make it portable."
    }
  }
}
```

## Shopping List Aggregation Example

When you add both recipes above to your weekly planner:

**Before Aggregation** (separate recipes):
- Carbonara Student: 2 eggs
- Pad Thai Student: 2 eggs

**After Aggregation** (shopping list):
```
Dairy:
- 4 pcs Eggs
- 200 ml Cream
- 50 g Parmesan

Meat:
- 100 g Bacon cubes
- 200 g Chicken breast

Grains:
- 500 g Spaghetti
- 200 g Rice noodles

Vegetables:
- 200 g Vegetables mix

Other:
- 3 tbsp Soy sauce
- 2 tbsp Peanut butter
```

## Usage in App

1. User searches for "Carbonara"
2. AI generates the three versions above
3. User views and toggles between versions
4. User adds Student version to Monday's plan
5. Shopping list automatically updates
6. User can then add more recipes for other days
7. Shopping list aggregates all ingredients

# Datenmodell

## Rezept (Recipe)
- `recipeId`: string
- `originalName`: string
- `versions`: { student, profi, airfryer }
- `sourceType`: 'text' | 'image' | 'video' | 'ocr' | 'social' | 'pantry'
- `createdAt`: ISO-String

## Zutaten (Ingredient)
- `item`: string
- `amount`: number
- `unit`: string
- `category`: string

## Versionen (RecipeVersions)
- `title`: string
- `prepTime`: string
- `ingredients`: Ingredient[]
- `steps`: string[]
- `tips`: string
- `calories`: number

## User- und Planner-Modelle
- Wochenplan: Array<Recipe>
- Einkaufsliste: Array<Ingredient>

Alle Typen sind in `/src/types/` zentral definiert.
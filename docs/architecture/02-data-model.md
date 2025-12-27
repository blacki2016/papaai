# ChefMate – Architektur 02: Datenmodell & JSON Schema

## Zweck
Dieses Dokument beschreibt das Datenmodell, das:
- die UI stabil rendern kann,
- AI-Ausgaben validierbar macht,
- Planner und Shopping-List konsistent hält.

## Zentrale Typen
Quelle: `src/types/recipe.ts`

### Ingredient
Repräsentiert eine einzelne Zutat.
- `item`: Anzeigename (String)
- `amount`: Menge (Number)
- `unit`: Einheit (String, z.B. `g`, `ml`, `Stk`)
- `category` (optional): Kategorie für Einkaufslisten-Gruppierung

### RecipeVersion
Eine Variante eines Rezepts.
- `title`: Titel der Version
- `prepTime`: z.B. `15 min`
- `ingredients[]`: Liste von Ingredients
- `steps[]`: Kochschritte als Strings
- `tips`: Freitext
- `calories` (optional)

### RecipeVersions
Genau drei Varianten:
- `student`
- `profi`
- `airfryer`

### Recipe
Persistiertes Rezeptobjekt.
- `recipeId`: UUID
- `originalName`: Original-Gericht/Name
- `versions`: `RecipeVersions`
- `sourceType` (optional): `text | pantry | ocr | social`
- `createdAt`: ISO Timestamp

### PlannerDay & PlannerSlot
- Planner ist eine Array-Liste von 7 Tagen.
- Jeder Tag besitzt `slots.breakfast/lunch/dinner` optional.
- `PlannerSlot` referenziert nur:
  - `recipeId`
  - `version` (`student|profi|airfryer`)

### ShoppingItem
Aggregierte Einkaufszeile:
- `item`, `amount`, `unit`, `category`
- `checked`: bool (abhaken)
- `recipeIds[]`: welche Rezepte dazu beigetragen haben

## AI JSON Output Schema (konzeptionell)
Der AI-Service muss im Kern liefern:

```json
{
  "originalName": "Carbonara",
  "versions": {
    "student": {
      "title": "Quick Carbonara",
      "prepTime": "15 min",
      "ingredients": [
        {"item": "Spaghetti", "amount": 500, "unit": "g", "category": "Vorrat"}
      ],
      "steps": ["..."],
      "tips": "...",
      "calories": 450
    },
    "profi": { "title": "...", "prepTime": "...", "ingredients": [], "steps": [], "tips": "..." },
    "airfryer": { "title": "...", "prepTime": "...", "ingredients": [], "steps": [], "tips": "..." }
  }
}
```

Im Client wird dieses JSON zu `Recipe` angereichert:
- `recipeId = uuidv4()`
- `createdAt = now()`
- `sourceType` aus der UI-Aktion

## Kategorien
Die Kategorien sind aktuell als Vorgabe im System Prompt formuliert:
- Gemüse, Milchprodukte, Fleisch, Fisch, Vorrat, Gewürze, Obst, Backwaren, Getränke, Sonstiges

Diese Kategorien sind wichtig, weil die ShoppingList pro Kategorie gruppiert.

## Validierungs-/Qualitätsregeln (empfohlen)
(aktuell nicht hart implementiert, aber sinnvoll als nächste Iteration)
- `amount` muss eine Zahl sein (>= 0)
- `ingredients` und `steps` dürfen nicht leer sein
- `versions` muss alle 3 Keys enthalten
- `unit` sollte konsistent sein (z.B. keine Mischung `g`/`gramm`)
- Shopping-Aggregation: nur zusammenführen, wenn `item` (case-insensitive) **und** `unit` gleich sind

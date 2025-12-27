# ChefMate – Architektur 03: State, Persistenz & Aggregation

## Zweck
Beschreibt:
- wie Zustand (Recipes/Planner/Shopping) verwaltet wird,
- wie Persistenz mit AsyncStorage funktioniert,
- wie Aggregation der Einkaufsliste implementiert ist.

## Zustand: Zustand Store
Quelle: `src/store/appStore.ts`

### State Shape
- `recipes: Recipe[]`
- `planner: PlannerDay[]` (7 Tage, Date ISO, Slots optional)
- `shoppingList: ShoppingItem[]`

### Actions
- `addRecipe(recipe)`
  - prepends Rezept
  - `saveData()`
- `removeRecipe(recipeId)`
  - filter
  - `saveData()`
- `addToPlan(dayIndex, slot, recipeId, version)`
  - setzt `planner[dayIndex].slots[slot]`
  - `regenerateShoppingList()`
  - `saveData()`
- `removeFromPlan(dayIndex, slot)`
  - delete Slot
  - `regenerateShoppingList()`
  - `saveData()`
- `toggleShoppingItem(index)`
  - invertiert `checked`
  - `saveData()`

## Persistenz: AsyncStorage
Keys:
- `recipes`
- `planner`
- `shoppingList`

### Ladeverhalten
Beim App-Start wird `loadData()` in `App.tsx` aufgerufen.
- Falls Keys fehlen: Default (leere `recipes`, initialisierter `planner`, leere `shoppingList`)

### Speichern
`saveData()` schreibt alle drei Keys.

## Aggregation: Smart Shopping List
Die Aggregation passiert in `regenerateShoppingList()`.

### Algorithmus
1. Iteriere alle Planner-Tage
2. Iteriere Slots (breakfast/lunch/dinner)
3. Finde referenziertes Rezept via `recipeId`
4. Nimm die gewählte Version (`recipe.versions[slotData.version]`)
5. Iteriere `ingredients`
6. Erzeuge Aggregations-Key:
   - `key = item.toLowerCase() + '-' + unit`
7. Wenn Key existiert: addiere `amount`, hänge `recipeId` an
8. Sonst: neues `ShoppingItem`

### Konsequenzen
- Aggregation ist stabil und deterministisch.
- Nur **gleiche Einheit** wird zusammengeführt.

### Edge Cases
- Unterschiedliche Schreibweisen (`Zwiebel` vs `Zwiebeln`) werden nicht gemerged.
- Einheiten-Normalisierung (`g` vs `gramm`) wird nicht erzwungen.

## Diagramm

```mermaid
flowchart LR
  P[Planner Slots]
  R[Recipes]
  A[Aggregator Map]
  S[ShoppingList]
  P --> R
  R --> A
  A --> S
```

## Verbesserungsideen (später)
- Normalisierung (Plural, Synonyme)
- Unit-Konvertierung (kg↔g, l↔ml)
- Re-Aggregation ohne `saveData()` pro Action (Batching)

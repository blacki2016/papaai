# ChefMate – Architektur 06: Gemini API Integration & Multimodalität

## Ziel
ChefMate wird um eine multimodale KI-Integration mit **Google Gemini** erweitert. Ziel ist, dass die App nativ folgende Inputs verarbeiten kann:

- **Text** (klassische Rezeptanfrage)
- **Bild** (Menu Scan / Speisekarte, Pantry Check / Kühlschrank)
- **Video** (Reel-to-Recipe: visuelle Handlungen + Audio-Kommentare)

Die Integration ist so gebaut, dass die UI nicht an einen Anbieter gebunden ist (siehe 07).

## Provider-Strategie (Hybrid)
Wir nutzen modellabhängig unterschiedliche Gemini-Modelle:

| Use Case | Modell | Begründung |
|---|---|---|
| Text & Bild (Menu Scan, Pantry) | `gemini-1.5-flash` | niedrigere Latenz, günstiger, stabil für strukturierte Ausgabe |
| Video (Reels/TikTok) | `gemini-1.5-pro` | besseres Reasoning über Zeit + Audio; höhere Qualität |

Implementiert in: [src/services/ai/geminiProvider.ts](../../src/services/ai/geminiProvider.ts)

## Structured Output / JSON-Schema
ChefMate erwartet ein **striktes** Rezept-JSON, das direkt auf das Domain-Modell gemappt werden kann:

- `Recipe.originalName`
- `Recipe.versions.student/profi/airfryer`
- Ingredients mit `item`, `amount`, `unit`, optional `category`

Schema-Definition erfolgt im Provider über `responseMimeType: "application/json"` und `responseSchema`.

Zusätzlich ist eine Robustheitsschicht notwendig, weil Modelle gelegentlich JSON in Code-Fences ausgeben.

Parsing-Utility: [src/utils/parseJson.ts](../../src/utils/parseJson.ts)

## Safety Settings (Wichtig für Kochrezepte)
Kochrezepte enthalten zwangsläufig „Dangerous Content“ (Messer, Hitze, Ofen). Wenn dieser Filter zu streng ist, blockiert das Modell legitime Kochanleitungen.

Konfiguration (Provider):
- `HARM_CATEGORY_DANGEROUS_CONTENT` → `BLOCK_ONLY_HIGH`
- Andere Kategorien bleiben moderat (z.B. `BLOCK_MEDIUM_AND_ABOVE`)

## Domain Mapping
Gemini liefert (geparstes) JSON, ChefMate ergänzt:

- `recipeId` (UUID)
- `createdAt` (ISO Date)
- `sourceType` (Attribution)

Attribution:
- `text` → `sourceType: 'text'`
- `image` → `sourceTypeHint: 'ocr'` (Menu Scan) oder `sourceTypeHint: 'pantry'` (Kühlschrank)
- `video` → `sourceTypeHint: 'social'`

## Konfiguration
Benötigte Env Var:

```env
EXPO_PUBLIC_GEMINI_API_KEY=...
```

Hinweis: `EXPO_PUBLIC_*` bedeutet: Key landet im Client-Bundle (siehe 10).

## Abhängigkeiten
Neue/benötigte Packages:
- `@google/generative-ai`
- `expo-file-system` (Video Upload)
- `expo-image-manipulator` (Image Resize/Compress)
- `expo-image-picker` (Input Auswahl)

## Grenzen / Annahmen
- Die App hat aktuell **kein Backend**.
- Video wird nicht als Base64 gesendet (zu groß), sondern via **Gemini Files API** hochgeladen.
- Uploads sind temporär und werden nach erfolgreicher Analyse best-effort gelöscht (siehe 08/10).

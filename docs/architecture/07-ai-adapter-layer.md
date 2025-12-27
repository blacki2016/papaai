# ChefMate – Architektur 07: AI Adapter Layer (Provider Entkopplung)

## Ziel
UI/Screens sollen nicht wissen, **welcher** AI-Provider aktiv ist (OpenAI vs. Gemini).

Dafür wird ein Adapter Layer eingeführt:
- UI spricht nur ein Interface an (`IAIService`)
- Provider-Details (Keys, Upload, Modelle, Parsing) liegen hinter dem Interface

## Interface
Definiert in: [src/types/ai.ts](../../src/types/ai.ts)

### `AIInput`
- `type: 'text' | 'image' | 'video'`
- `content: string`
  - bei `text`: Prompt
  - bei `image`: Aufgabenbeschreibung/Prompt
  - bei `video`: lokale Datei-URI
- `mediaData?: string` (Base64 für Bilder)
- `mimeType?: string` (z.B. `image/jpeg`)
- `sourceTypeHint?: Recipe['sourceType']` (Attribution im Domain Model)

### `IAIService`
- `generateRecipe(input: AIInput, onStatus?: (status: string) => void): Promise<Recipe>`

`onStatus` ist absichtlich sehr simpel, um UI-Progress („Upload…“, „Processing…“) ohne zusätzliche State-Maschinerie zu ermöglichen.

## Provider-Switch
Zentrale Weiche in: [src/services/ai/aiService.ts](../../src/services/ai/aiService.ts)

Aktuell:
- Default ist `GeminiProvider`

Optionaler Legacy-Provider:
- [src/services/ai/openAIProvider.ts](../../src/services/ai/openAIProvider.ts)

## Warum diese Struktur?
- Screens bleiben klein und testbar.
- Provider kann gewechselt werden, ohne UI anzufassen.
- Video-Upload / Polling ist komplex (RN/Expo) und gehört nicht in Screens.

## Erweiterbarkeit
Neue Provider hinzufügen:
1. Neue Klasse implementiert `IAIService`
2. In `aiService.ts` auf diesen Provider umschalten

Beispiel: `AnthropicProvider`, `LocalLLMProvider`, BackendProxy etc.

## Fehlerbehandlung Philosophie
- Provider wirft technische Fehler (Key fehlt, Upload/JSON Parse fehlgeschlagen)
- UI zeigt eine generische Fehlermeldung und bleibt stabil

(Details zu Security/Key-Handling in 10)

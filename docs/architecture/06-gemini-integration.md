# ChefMate – Architektur 06: Gemini API Integration & Multimodalität

## Übersicht
Dieses Dokument beschreibt die Implementierung der multimodalen KI-Integration mittels Google Gemini API. Die Integration ergänzt den bisherigen OpenAI-Service und nutzt die spezifischen Stärken von Gemini (großes Kontext-Fenster, native Bild- und Video-Verarbeitung).

## Implementierte Features

### 1. Adapter Pattern
Die Integration folgt dem Adapter Pattern für eine saubere Trennung zwischen UI und AI-Provider:

- **IAIService Interface**: Abstraktes Interface für alle AI-Provider
- **AIInput Type**: Einheitlicher Input-Typ mit `type`, `content`, `mediaData`, `sourceType`
- **GeminiProvider**: Implementierung für Google Gemini
- **OpenAIProvider**: Refaktorierter OpenAI Service als Fallback
- **Factory Function**: `createAIService()` wählt automatisch den passenden Provider

### 2. Modell-Strategie

| Anwendungsfall | Modell | Begründung |
|----------------|--------|------------|
| Text & Bild (Suche, Menu-Scan) | Gemini 1.5 Flash | Extrem schnell, kostengünstig, ideal für strukturierte Datenextraktion (OCR/JSON) |
| Video (Reels, TikTok) | Gemini 1.5 Pro | Komplexes "Reasoning" über Zeitverläufe und Audio-Spuren (In Entwicklung) |

### 3. Safety Settings
Wichtige Konfiguration für Kochinhalte:
```typescript
{
  category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Messer, Hitze sind normal beim Kochen
}
```

### 4. JSON Mode
- Verwendet `responseMimeType: "application/json"` für strukturierte Ausgabe
- Utility `parseAIJson()` behandelt Markdown-Code-Blöcke (```json ... ```)

## Datenflüsse

### Flow A: Text-Verarbeitung
```
UI → aiService.generateRecipe({ type: 'text', content: 'Pizza' })
  → GeminiProvider.generateFromText()
  → Gemini 1.5 Flash API
  → JSON Response → Recipe Object
```

### Flow B: Bild-Verarbeitung (Vision)
```
UI → ImagePicker (Kamera/Galerie)
  → prepareImageForAI() (Resize, Base64 Konvertierung)
  → aiService.generateRecipeFromImage(base64, prompt)
  → GeminiProvider.generateFromImage()
  → Gemini 1.5 Flash API (mit inlineData)
  → JSON Response → Recipe Object
```

### Flow C: Video-Verarbeitung (In Entwicklung)
```
UI → ImagePicker (Video)
  → Google File API Upload
  → Polling bis Status = ACTIVE
  → GeminiProvider.generateFromVideo()
  → Gemini 1.5 Pro API (mit File URI)
  → Cleanup (DELETE File)
  → JSON Response → Recipe Object
```

## Dateien

### Neue Dateien
- `src/types/ai.ts` - AI Service Interfaces
- `src/services/ai/GeminiProvider.ts` - Gemini Implementation
- `src/services/ai/OpenAIProvider.ts` - OpenAI Refactoring
- `src/services/ai/index.ts` - Factory und Exports
- `src/services/ai/jsonParser.ts` - JSON Parsing Utility
- `src/services/aiService.ts` - Unified Service Interface
- `src/utils/imageUtils.ts` - Bild-Preprocessing

### Geänderte Dateien
- `src/screens/HomeScreen.tsx` - Kamera/Galerie Integration, Loading States
- `README.md` - Dokumentation aktualisiert
- `package.json` - Dependencies hinzugefügt

### Deprecated
- `src/services/openaiService.ts` - Wird durch `aiService.ts` ersetzt

## Dependencies
```json
{
  "@google/generative-ai": "^1.0.0",
  "expo-file-system": "^17.0.0",
  "expo-image-picker": "^17.0.10"
}
```

## Konfiguration
Die App wählt automatisch den Provider basierend auf verfügbaren API Keys:

```env
# Bevorzugt (Multimodal Support)
EXPO_PUBLIC_GEMINI_API_KEY=your-key-here

# Fallback (nur Text)
EXPO_PUBLIC_OPENAI_API_KEY=your-key-here
```

## UI Verbesserungen
- Neue Buttons: "Kamera" (📸), "Speisekarte" (🖼️)
- Detaillierte Loading States mit Fortschrittsanzeige
- ActivityIndicator während der Verarbeitung

## Bekannte Einschränkungen
1. **Video-Support**: Noch nicht implementiert (benötigt Google File API Integration)
2. **Client-Side API Keys**: Unsicher für Produktion (sollte über Backend-Proxy laufen)
3. **Error Handling**: Gemini-spezifische Fehler könnten detaillierter behandelt werden
4. **Retry Logic**: Keine automatische Wiederholung bei temporären Fehlern

## Nächste Schritte
1. Google File API Integration für Video-Upload
2. Polling-Logik für Video-Verarbeitung
3. Backend-Proxy für sichere API-Key-Verwaltung
4. Erweiterte Fehlerbehandlung und Retry-Logik
5. Unit Tests für neue Services

## Security Hinweise
- API Keys liegen client-seitig (EXPO_PUBLIC_* Prefix)
- Für Produktion: Edge Functions als Proxy nutzen (Firebase/Supabase)
- User sollte vor Speichern zum Edit-Screen geleitet werden (Halluzinationen möglich)

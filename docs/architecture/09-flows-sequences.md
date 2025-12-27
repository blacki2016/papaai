# ChefMate – Architektur 09: Datenflüsse & Sequenzen (Multimodal)

## Zweck
Dieses Dokument beschreibt die End-to-End Flows für:
- Text → Rezept
- Menu Scan (Bild) → Rezept
- Pantry Foto (Bild) → Rezept
- Reel-to-Recipe (Video) → Rezept

## Flow: Text
Quelle: [src/screens/HomeScreen.tsx](../../src/screens/HomeScreen.tsx)

```mermaid
sequenceDiagram
  participant UI as HomeScreen
  participant AI as aiService (GeminiProvider)

  UI->>AI: generateRecipe({type:'text', content})
  AI-->>UI: Recipe
  UI->>UI: addRecipe + navigate(recipe-detail)
```

## Flow: Menu Scan (Bild)

```mermaid
sequenceDiagram
  participant UI as HomeScreen
  participant Media as media utils
  participant AI as GeminiProvider

  UI->>UI: Kamera öffnen (ImagePicker)
  UI->>Media: prepareImageForUpload(uri)
  Media-->>UI: resizedUri + mimeType
  UI->>Media: uriToBase64(resizedUri)
  Media-->>UI: base64
  UI->>AI: generateRecipe({type:'image', mediaData: base64, sourceTypeHint:'ocr'})
  AI-->>UI: Recipe
  UI->>UI: addRecipe + navigate(recipe-detail)
```

## Flow: Pantry Check (Bild)
Identisch zum Menu Scan, aber mit anderer Aufgabenbeschreibung und Attribution:
- `sourceTypeHint: 'pantry'`

## Flow: Reel-to-Recipe (Video)

```mermaid
sequenceDiagram
  participant UI as HomeScreen
  participant AI as GeminiProvider
  participant Files as Gemini Files API

  UI->>UI: Video aus Galerie wählen
  UI->>AI: generateRecipe({type:'video', content: localUri})
  AI->>Files: POST /upload/v1beta/files (uploadAsync)
  Files-->>AI: {name, uri, state: PROCESSING}

  loop Polling
    AI->>Files: GET /v1beta/{name}
    Files-->>AI: state=PROCESSING | ACTIVE | FAILED
  end

  AI->>AI: generateContent(model=gemini-1.5-pro, fileData=fileUri)
  AI-->>UI: Recipe

  AI->>Files: DELETE /v1beta/{name} (best-effort cleanup)
```

## Fehlerpfade (kurz)
- Missing API key → Provider wirft Fehler
- JSON Parse fails → Utility versucht zu extrahieren, sonst Fehler
- Video: `FAILED` → Fehler + Abbruch
- Video: Timeout → Fehler + Abbruch

UI zeigt derzeit eine generische Meldung „Rezept konnte nicht generiert werden“.

## Datenpersistenz
Nach erfolgreicher Generierung:
- `addRecipe(recipe)` speichert im Zustand Store
- Store persistiert via AsyncStorage

Siehe bestehende Dokumente:
- 03-state-storage
- 02-data-model

# ChefMate – Architektur 08: Media Pipeline (Bild & Video)

## Ziel
Multimodal-Inputs müssen in Expo/React Native ressourcenschonend verarbeitet werden.

Hauptprobleme:
- Bilder sind oft zu groß (Bandbreite/Latenz)
- Videos sind zu groß für Base64 (OOM-Risiko) und müssen via Files API hochgeladen werden

## Bild-Pipeline (Menu Scan / Pantry Check)
Quelle: [src/utils/media.ts](../../src/utils/media.ts)

### Schritte
1. Aufnahme/Selektion via `expo-image-picker`
2. Preprocessing via `expo-image-manipulator`
   - Resize (max ~1024px Breite)
   - JPEG + Kompression
3. Base64-Konvertierung via `expo-file-system`
4. Gemini `inlineData` Request

### Motivation
- reduziert Upload-Size
- beschleunigt Inferenz
- verringert Absturzrisiken

## Video-Pipeline (Reel-to-Recipe)
Quelle: [src/services/ai/geminiFilesApi.ts](../../src/services/ai/geminiFilesApi.ts)

### Warum Files API?
Gemini empfiehlt die Files API, sobald Requests insgesamt zu groß werden. Video ist in RN/Expo zudem nicht sinnvoll als Base64 zu handeln.

### Schritte
1. Video-Auswahl via `expo-image-picker` (`mediaTypes: ['videos']`)
2. Upload über `FileSystem.uploadAsync()` an
   - `POST https://generativelanguage.googleapis.com/upload/v1beta/files?key=...`
   - Upload als `BINARY_CONTENT` direkt von Disk
3. Polling bis der File-State `ACTIVE` ist
   - `GET https://generativelanguage.googleapis.com/v1beta/{name}?key=...`
4. Inferenz mit `fileData: { fileUri, mimeType }` auf `gemini-1.5-pro`
5. Cleanup (best-effort)
   - `DELETE https://generativelanguage.googleapis.com/v1beta/{name}?key=...`

### Status-UI
Da Video länger dauert, bietet der Provider Statusmeldungen an:
- „Video wird hochgeladen…“
- „Video wird verarbeitet…“
- „Analyse läuft…“
- „Aufräumen…“

UI setzt diese Status in Text um: [src/screens/HomeScreen.tsx](../../src/screens/HomeScreen.tsx)

## MIME-Type Heuristik
Helper: `guessMimeTypeFromUri()`
- nutzt Dateiendungen (jpg/png/mp4/mov)

## Limits / Failure Modes
- Upload kann scheitern (Netz, Key, Dateigröße)
- Processing kann `FAILED` werden
- Polling kann in Timeout laufen (Default 60s)

Fehler werden als Exception geworfen und in UI generisch abgefangen.

## Datenschutz
- Uploads sind temporär
- Nach erfolgreicher Analyse wird ein Delete versucht
- Für Produktion wird ein Proxy empfohlen (siehe 10)

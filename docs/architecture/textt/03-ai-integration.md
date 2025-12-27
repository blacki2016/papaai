# AI-Integration

## Provider
- **GeminiProvider**: Einbindung von Google Gemini für Text, Bild und Video
- Schnittstelle: `IAIService` (Text, Bild, Video als Input)

## Ablauf Rezeptgenerierung
1. Nutzer gibt Text, Bild oder Video ein
2. `aiService` ruft GeminiProvider auf
3. Antwort wird geparst und als Recipe-Objekt gespeichert

## Sicherheit & Datenschutz
- API-Key nur clientseitig, Empfehlung: Proxy für Produktion
- Automatisches Löschen von hochgeladenen Medien nach Analyse
- Safety-Filter für toxische Inhalte

## Erweiterbarkeit
- Provider-Layer erlaubt Austausch/Erweiterung (z.B. weitere KI-Modelle)

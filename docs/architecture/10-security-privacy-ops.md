# ChefMate – Architektur 10: Security, Privacy & Operational Notes

## Ziel
Dokumentiert Risiken und empfohlene Maßnahmen rund um:
- API Keys im Client
- Medien-Uploads (Video)
- Datenschutz
- Stabilität/Rate Limits

## Client-Side Keys (Expo)
In Expo bedeutet `EXPO_PUBLIC_*`:
- Variable ist **zur Laufzeit im Client verfügbar**
- kann im App-Bundle extrahiert werden

Aktuell verwendet:
```env
EXPO_PUBLIC_GEMINI_API_KEY=...
EXPO_PUBLIC_OPENAI_API_KEY=... (optional/legacy)
```

Konsequenzen:
- Key-Missbrauch möglich
- keine saubere Authentifizierung pro User
- Rate-Limits/Kosten schwer kontrollierbar

## Empfohlenes Produktions-Setup
Für Produktion sollte AI-Traffic über einen Proxy laufen:
- Firebase Functions / Supabase Edge Function / eigener Server
- Client authentifiziert sich
- Server hält Provider Keys geheim
- Server throttled, logged, validiert Input

## Datenschutz bei Medien (Video)
Video-Upload nutzt die Gemini Files API (temporärer Speicher).

Maßnahmen:
- Best-effort Cleanup (DELETE) nach erfolgreicher Generierung
- Statuskommunikation in UI (Transparenz)
- In Produktion: klarer Hinweis/Opt-In und Löschkonzept

Implementierung Cleanup:
- [src/services/ai/geminiProvider.ts](../../src/services/ai/geminiProvider.ts)

## Safety Settings
Kochrezepte dürfen nicht unnötig geblockt werden.

Wichtig:
- `DANGEROUS_CONTENT` = `BLOCK_ONLY_HIGH`

Risiko:
- zu strenge Filter → legitime Anleitungen (Messer/Hitze) werden blockiert

## Robustheit: JSON Parsing
Auch mit `responseMimeType: application/json` können Modelle gelegentlich Code-Fences oder Text drumherum senden.

Mitigation:
- `extractJsonObjectFromText()` entfernt Fences und extrahiert den ersten JSON-Block

Quelle:
- [src/utils/parseJson.ts](../../src/utils/parseJson.ts)

## Observability / Debugging (MVP)
Aktuell:
- UI zeigt generische Fehlermeldung
- keine Telemetrie

Empfehlungen:
- in Dev: detailliertere Fehlertexte (Upload vs. Parse vs. Safety)
- optional: Logging (ohne PII) über Sentry/LogRocket

## Betrieb / Kosten
- Video-Analysen sind teurer/langsamer (Pro-Modell + Upload + Processing)
- Polling hat Default-Timeout 60s

Empfehlungen:
- UI klar kommunizieren („kann 10–20s dauern“)
- Abbruchmöglichkeit (später)
- Rate Limiting über Proxy (Prod)

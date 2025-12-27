# ChefMate - AI-Powered Adaptive Recipe App

Ein React Native Expo App, die KI nutzt, um Rezepte in drei verschiedene Varianten zu generieren: Student/Einfach, Airfryer, und Profi/Authentisch.

## 🚀 Features

- **Tri-Level Recipe Engine**: Jedes Rezept in 3 Versionen (Student, Profi, Airfryer)
- **Multi-Source Import**: 
  - Textsuche
  - Pantry/Vorrat (Zutaten eingeben)
  - **OCR (Foto von Speisekarte mit Gemini Vision)** ✅
  - **Kamera-Integration für Speisen-Fotos** ✅
  - Social Media Links (In Entwicklung)
- **Wochenplaner**: Organisiere deine Mahlzeiten für die ganze Woche
- **Smart Shopping List**: Automatische Aggregation aller benötigten Zutaten

## 📋 Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn
- Expo CLI
- iOS Simulator (Mac) oder Android Emulator

## 🛠️ Installation

```bash
# Abhängigkeiten installieren
npm install

# App starten
npm start

# Für iOS
npm run ios

# Für Android
npm run android

# Für Web
npm run web
```

## ⚙️ Konfiguration

### AI Provider Setup

Die App unterstützt zwei KI-Provider:

#### Google Gemini (Empfohlen)

Google Gemini bietet native Unterstützung für multimodale Eingaben (Text, Bild, Video):

1. Erstelle einen Account bei [Google AI Studio](https://ai.google.dev/)
2. Generiere einen API Key
3. Erstelle eine `.env` Datei im Projektverzeichnis:

```env
EXPO_PUBLIC_GEMINI_API_KEY=dein-gemini-api-key-hier
```

**Vorteile**:
- Native Bild-Verarbeitung (OCR für Speisekarten)
- Video-Analyse (Cooking Videos/Reels) - In Entwicklung
- Großes Kontext-Fenster
- Kosteneffizient

#### OpenAI (Legacy/Fallback)

Alternativ kann OpenAI verwendet werden (nur Text-Eingabe):

1. Erstelle einen Account bei [OpenAI](https://platform.openai.com/)
2. Generiere einen API Key
3. Füge in der `.env` Datei hinzu:

```env
EXPO_PUBLIC_OPENAI_API_KEY=dein-openai-api-key-hier
```

**Hinweis**: Die App wählt automatisch Gemini, wenn beide Keys konfiguriert sind.

## 📁 Projektstruktur

```
papaai/
├── src/
│   ├── components/       # UI-Komponenten (RecipeCard, Navigation)
│   ├── screens/          # App-Screens (Home, Planner, Shopping, RecipeDetail)
│   ├── services/         
│   │   ├── ai/          # AI Provider (Gemini, OpenAI)
│   │   ├── aiService.ts # Unified AI Service Interface
│   │   └── openaiService.ts # Legacy OpenAI Service (deprecated)
│   ├── store/            # Zustand Store für State Management
│   ├── types/            # TypeScript Type Definitions
│   └── utils/            # Utility Functions (Image Processing, etc.)
├── assets/               # App Icons und Splash Screens
├── docs/                 # Architecture Documentation
├── App.tsx               # Root Component
├── app.json              # Expo Konfiguration
└── tailwind.config.js    # NativeWind/Tailwind Konfiguration
```

## 🎨 Tech Stack

- **Framework**: React Native mit Expo
- **Sprache**: TypeScript
- **Styling**: NativeWind (Tailwind CSS für React Native)
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **AI**: Google Gemini 1.5 (Flash & Pro) / OpenAI GPT-4o (Fallback)
- **Camera**: expo-camera, expo-image-picker
- **File System**: expo-file-system

## 📱 Features im Detail

### Recipe Generation
Die KI generiert für jedes Rezept drei Versionen:
- **Student**: Schnell, günstig, einfache Zutaten
- **Profi**: Authentisch, hochwertige Zutaten, beste Technik
- **Airfryer**: Optimiert für Airfryer und moderne Küchengeräte

### Wochenplaner
- 7-Tage-Übersicht
- 3 Mahlzeiten pro Tag (Frühstück, Mittag, Abend)
- Drag-and-Drop Interface (geplant)

### Smart Shopping List
- Automatische Aggregation identischer Zutaten
- Kategorisierung (Gemüse, Fleisch, Milchprodukte, etc.)
- Check-off Funktion

## 🔮 Roadmap

- [x] Adapter Pattern für AI Services
- [x] Google Gemini Integration
- [x] Multimodale Bild-Verarbeitung (Vision API)
- [x] Kamera und Galerie Integration
- [ ] Video-Analyse (Cooking Reels/TikToks)
- [ ] Google File API Integration für Video-Upload
- [ ] Social Media Parser (TikTok/Instagram)
- [ ] Offline-Modus
- [ ] Drag-and-Drop im Planner
- [ ] Rezept-Favoriten
- [ ] Nährwertanalyse
- [ ] Allergen-Filter

## 📄 Lizenz

MIT

## 👥 Autor

Entwickelt mit ❤️ und KI

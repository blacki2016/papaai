# ChefMate - AI-Powered Adaptive Recipe App

Ein React Native Expo App, die KI nutzt, um Rezepte in drei verschiedene Varianten zu generieren: Student/Einfach, Airfryer, und Profi/Authentisch.

## 🚀 Features

- **Tri-Level Recipe Engine**: Jedes Rezept in 3 Versionen (Student, Profi, Airfryer)
- **Multi-Source Import**: 
  - Textsuche
  - Pantry/Vorrat (Zutaten eingeben)
  - OCR (Foto von Speisekarte)
  - Social Media Links (TikTok/Instagram)
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



### Gemini API Key (Multimodal)

Für Menu Scan (Bild), Pantry Check (Bild) und Reel-to-Recipe (Video) nutzt die App Google Gemini.

1. API Key in Google AI Studio erstellen
2. `.env` im Projektverzeichnis anlegen:

```env
EXPO_PUBLIC_GEMINI_API_KEY=dein-gemini-api-key-hier
```

**Hinweis**: API-Keys liegen client-seitig (Expo). Für Produktion empfiehlt sich ein Proxy (z.B. Firebase/Supabase Edge Function).

## 📁 Projektstruktur

```
papaai/
├── src/
│   ├── components/       # UI-Komponenten (RecipeCard, Navigation)
│   ├── screens/          # App-Screens (Home, Planner, Shopping, RecipeDetail)
│   ├── services/         # KI-Service für Rezeptgenerierung
│   ├── store/            # Zustand Store für State Management
│   └── types/            # TypeScript Type Definitions
├── assets/               # App Icons und Splash Screens
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
- **AI**: Google Gemini API
- **Camera**: expo-camera, expo-image-picker

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

- [ ] Echte OCR-Integration für Speisekarten-Fotos
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

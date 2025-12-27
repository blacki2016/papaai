# Architektur-Übersicht

ChefMate ist eine KI-gestützte Rezept-App, die auf React Native (Expo) basiert und Google Gemini als AI-Provider nutzt. Die Architektur ist modular aufgebaut und trennt klar zwischen UI, State-Management, Services und AI-Integration.

## Hauptkomponenten
- **UI-Komponenten**: Wiederverwendbare Bausteine für Rezepte, Navigation, Listen
- **Screens**: Home, Wochenplaner, Rezeptdetails, Einkaufsliste
- **Services**: KI-Provider (Gemini), Media-Handling, Fehlerbehandlung
- **Store**: Globales State-Management mit Zustand
- **Types**: Zentrale TypeScript-Typdefinitionen

## Datenfluss
1. Nutzerinteraktion löst Aktion im UI aus
2. State-Änderung im Store
3. Service-Aufruf (z.B. Rezeptgenerierung via Gemini)
4. Ergebnis wird im UI angezeigt

## Ziel
Eine flexible, erweiterbare und sichere Plattform für KI-gestützte Rezept- und Küchenfunktionen.
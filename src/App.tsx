import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// HIER SPÄTER DEINE ECHTEN IMPORTS EINFÜGEN:
// import { GeminiProvider } from './services/ai/GeminiProvider';
// import HomeScreen from './screens/HomeScreen';
// import PlannerScreen from './screens/PlannerScreen';

// Platzhalter-Komponente, damit der Build funktioniert (löschen, wenn HomeScreen fertig ist)
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>ChefMate: {name}</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <GeminiProvider>  <-- Später einkommentieren
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* Definiere die Routen gemäß deiner Doku */}
          
          <Stack.Screen name="Home">
            {/* Ersetze PlaceholderScreen mit: (props) => <HomeScreen {...props} /> */}
            {props => <PlaceholderScreen name="Home Screen" />}
          </Stack.Screen>

          <Stack.Screen name="Planner">
             {props => <PlaceholderScreen name="Wochenplaner" />}
          </Stack.Screen>

          <Stack.Screen name="RecipeDetail">
             {props => <PlaceholderScreen name="Rezept Details" />}
          </Stack.Screen>

          <Stack.Screen name="ShoppingList">
             {props => <PlaceholderScreen name="Einkaufsliste" />}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    // </GeminiProvider>
  );
}
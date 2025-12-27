import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import {
  HomeScreen,
  TextSearchScreen,
  PantryInputScreen,
  OCRScanScreen,
  SocialImportScreen,
  RecipeDetailScreen,
  RecipeListScreen,
  WeeklyPlannerScreen,
  ShoppingListScreen,
  SettingsScreen,
} from './src/screens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TextSearch"
          component={TextSearchScreen}
          options={{ title: 'Text Search' }}
        />
        <Stack.Screen
          name="PantryInput"
          component={PantryInputScreen}
          options={{ title: 'Pantry Ingredients' }}
        />
        <Stack.Screen
          name="OCRScan"
          component={OCRScanScreen}
          options={{ title: 'Menu Scanner' }}
        />
        <Stack.Screen
          name="SocialImport"
          component={SocialImportScreen}
          options={{ title: 'Social Media Import' }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ title: 'Recipe' }}
        />
        <Stack.Screen
          name="RecipeList"
          component={RecipeListScreen}
          options={{ title: 'My Recipes' }}
        />
        <Stack.Screen
          name="WeeklyPlanner"
          component={WeeklyPlannerScreen}
          options={{ title: 'Weekly Planner' }}
        />
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{ title: 'Shopping List' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StatusBar } from 'react-native';
import { Navigation } from './src/components/Navigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlannerScreen } from './src/screens/PlannerScreen';
import { ShoppingListScreen } from './src/screens/ShoppingListScreen';
import { RecipeDetailScreen } from './src/screens/RecipeDetailScreen';
import { useAppStore } from './src/store/appStore';
import { AppView, Recipe } from './src/types/recipe';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const { loadData } = useAppStore();

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigate = (newView: AppView, data?: { recipe?: Recipe }) => {
    if (newView === 'recipe-detail' && data?.recipe) {
      setCurrentRecipe(data.recipe);
    }
    setView(newView);
  };

  const handleBack = () => {
    setView('home');
    setCurrentRecipe(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {view === 'home' && <HomeScreen onNavigate={handleNavigate} />}
      {view === 'planner' && <PlannerScreen onNavigate={handleNavigate} />}
      {view === 'shopping' && <ShoppingListScreen />}
      {view === 'recipe-detail' && currentRecipe && (
        <RecipeDetailScreen recipe={currentRecipe} onBack={handleBack} />
      )}

      {view !== 'recipe-detail' && (
        <Navigation currentView={view} onNavigate={handleNavigate} />
      )}
    </SafeAreaView>
  );
}

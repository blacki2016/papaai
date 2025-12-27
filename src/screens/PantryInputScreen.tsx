import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { AIService } from '../services/aiService';

interface PantryInputScreenProps {
  navigation: any;
}

export const PantryInputScreen: React.FC<PantryInputScreenProps> = ({ navigation }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiKey, addRecipe } = useAppStore();

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient');
      return;
    }

    if (!apiKey) {
      setError('Please set your OpenAI API key in Settings');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const aiService = new AIService({ apiKey });
      const ingredientList = ingredients.split(',').map(i => i.trim());
      
      const recipe = await aiService.generateRecipeVersions({
        type: 'pantry',
        data: ingredientList,
      });

      addRecipe(recipe);
      
      // Navigate to recipe detail
      navigation.navigate('RecipeDetail', { recipe });
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Pantry Ingredients</Text>
          <Text style={styles.subtitle}>
            Enter ingredients you have, and we'll suggest a recipe
          </Text>

          <Text style={styles.label}>Available Ingredients:</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g., Tomato, Eggs, Cheese, Onion..."
            value={ingredients}
            onChangeText={setIngredients}
            editable={!loading}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>
            Separate ingredients with commas
          </Text>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Generate Recipe</Text>
            )}
          </TouchableOpacity>

          <View style={styles.exampleBox}>
            <Text style={styles.exampleTitle}>💡 Example combinations:</Text>
            <Text style={styles.exampleItem}>
              • Pasta, Tomatoes, Garlic → Pasta al Pomodoro
            </Text>
            <Text style={styles.exampleItem}>
              • Eggs, Potatoes, Onion → Spanish Tortilla
            </Text>
            <Text style={styles.exampleItem}>
              • Rice, Chicken, Vegetables → Fried Rice
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 120,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    marginBottom: 15,
    textAlign: 'center',
  },
  exampleBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  exampleItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

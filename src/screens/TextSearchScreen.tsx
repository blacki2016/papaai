import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { AIService } from '../services/aiService';

interface TextSearchScreenProps {
  navigation: any;
}

export const TextSearchScreen: React.FC<TextSearchScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiKey, addRecipe } = useAppStore();

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setError('Please enter a recipe name');
      return;
    }

    if (!apiKey) {
      setError('Please set your Gemini API key in Settings');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const aiService = new AIService({ apiKey });
      const recipe = await aiService.generateRecipeVersions({
        type: 'text',
        data: searchText,
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
      <View style={styles.content}>
        <Text style={styles.title}>Search Recipe</Text>
        <Text style={styles.subtitle}>
          Enter the name of a recipe to generate three versions
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g., Carbonara, Lasagne, Pad Thai..."
          value={searchText}
          onChangeText={setSearchText}
          editable={!loading}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Generate Recipe</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✨ What you'll get:</Text>
          <Text style={styles.infoItem}>• Student Version - Quick & budget-friendly</Text>
          <Text style={styles.infoItem}>• Airfryer Version - Using convenience devices</Text>
          <Text style={styles.infoItem}>• Profi Version - Authentic & professional</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
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
  infoBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

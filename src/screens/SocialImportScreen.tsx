import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { AIService } from '../services/aiService';

interface SocialImportScreenProps {
  navigation: any;
}

export const SocialImportScreen: React.FC<SocialImportScreenProps> = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiKey, addRecipe } = useAppStore();

  const handleImport = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!apiKey) {
      setError('Please set your Gemini API key in Settings');
      return;
    }

    // Basic URL validation
    if (!url.includes('tiktok.com') && !url.includes('instagram.com')) {
      setError('Please enter a valid TikTok or Instagram URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real implementation, you would extract video transcript/content
      // For now, we'll simulate with a placeholder
      const aiService = new AIService({ apiKey });
      const recipe = await aiService.generateRecipeVersions({
        type: 'social',
        data: `Social media recipe from: ${url}`,
      });

      addRecipe(recipe);
      
      // Navigate to recipe detail
      navigation.navigate('RecipeDetail', { recipe });
    } catch (err) {
      setError('Failed to import recipe. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Social Media Import</Text>
          <Text style={styles.subtitle}>
            Import recipes from TikTok or Instagram posts
          </Text>

          <Text style={styles.label}>Post URL:</Text>
          <TextInput
            style={styles.input}
            placeholder="https://www.tiktok.com/@user/video/..."
            value={url}
            onChangeText={setUrl}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleImport}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Import Recipe</Text>
            )}
          </TouchableOpacity>

          <View style={styles.platformsBox}>
            <Text style={styles.platformsTitle}>🎥 Supported Platforms:</Text>
            <View style={styles.platformItem}>
              <Text style={styles.platformIcon}>📱</Text>
              <Text style={styles.platformText}>TikTok</Text>
            </View>
            <View style={styles.platformItem}>
              <Text style={styles.platformIcon}>📷</Text>
              <Text style={styles.platformText}>Instagram</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>ℹ️ How it works:</Text>
            <Text style={styles.infoItem}>
              1. Copy the link to a recipe video
            </Text>
            <Text style={styles.infoItem}>
              2. Paste it here
            </Text>
            <Text style={styles.infoItem}>
              3. Our AI extracts the recipe and creates three versions
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
  platformsBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  platformsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  platformIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  platformText: {
    fontSize: 16,
    color: '#666',
  },
  infoBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoItem: {
    fontSize: 14,
    color: '#1565c0',
    marginBottom: 5,
  },
});

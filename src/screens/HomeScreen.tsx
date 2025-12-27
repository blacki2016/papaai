import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAppStore } from '../store/appStore';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { loadFromStorage, recipes, apiKey } = useAppStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const importOptions = [
    {
      title: 'Text Search',
      description: 'Search for a recipe by name',
      icon: '🔍',
      route: 'TextSearch',
    },
    {
      title: 'Pantry Ingredients',
      description: 'Create recipe from available ingredients',
      icon: '🥘',
      route: 'PantryInput',
    },
    {
      title: 'Restaurant Menu',
      description: 'Scan a menu or dish photo',
      icon: '📸',
      route: 'OCRScan',
    },
    {
      title: 'Social Media',
      description: 'Import from TikTok/Instagram',
      icon: '📱',
      route: 'SocialImport',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>ChefMate</Text>
          <Text style={styles.subtitle}>AI-Powered Adaptive Recipes</Text>
        </View>

        {!apiKey && (
          <TouchableOpacity
            style={styles.warningBox}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.warningText}>
              ⚠️ Please set your OpenAI API key in Settings
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{recipes.length}</Text>
            <Text style={styles.statLabel}>Recipes</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Import Recipe</Text>
          {importOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(option.route)}
            >
              <Text style={styles.cardIcon}>{option.icon}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardDescription}>{option.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('WeeklyPlanner')}
          >
            <Text style={styles.cardIcon}>📅</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Weekly Planner</Text>
              <Text style={styles.cardDescription}>
                Plan your meals for the week
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ShoppingList')}
          >
            <Text style={styles.cardIcon}>🛒</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Shopping List</Text>
              <Text style={styles.cardDescription}>
                View aggregated shopping list
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RecipeList')}
          >
            <Text style={styles.cardIcon}>📖</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>My Recipes</Text>
              <Text style={styles.cardDescription}>
                Browse saved recipes
              </Text>
            </View>
          </TouchableOpacity>
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
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  warningBox: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

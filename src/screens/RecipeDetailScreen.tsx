import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Recipe, RecipeVersionType } from '../types/recipe';

interface RecipeDetailScreenProps {
  route: any;
  navigation: any;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route, navigation }) => {
  const recipe: Recipe = route.params?.recipe;
  const [selectedVersion, setSelectedVersion] = useState<RecipeVersionType>('student');

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Recipe not found</Text>
      </SafeAreaView>
    );
  }

  const version = recipe.versions[selectedVersion];

  const versionButtons = [
    { key: 'student', label: '🎓 Student', color: '#4CAF50' },
    { key: 'airfryer', label: '🍳 Airfryer', color: '#FF9800' },
    { key: 'profi', label: '👨‍🍳 Profi', color: '#9C27B0' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.originalName}>{recipe.originalName}</Text>
        </View>

        <View style={styles.versionSelector}>
          {versionButtons.map((btn) => (
            <TouchableOpacity
              key={btn.key}
              style={[
                styles.versionButton,
                selectedVersion === btn.key && {
                  backgroundColor: btn.color,
                },
              ]}
              onPress={() => setSelectedVersion(btn.key as RecipeVersionType)}
            >
              <Text
                style={[
                  styles.versionButtonText,
                  selectedVersion === btn.key && styles.versionButtonTextActive,
                ]}
              >
                {btn.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{version.title}</Text>
          <Text style={styles.prepTime}>⏱️ Prep Time: {version.prepTime}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {version.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ingredientText}>
                  {ingredient.amount} {ingredient.unit} {ingredient.item}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {version.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipsBox}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <Text style={styles.tipsText}>{version.tips}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.footerButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  originalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  versionSelector: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  versionButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  versionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  versionButtonTextActive: {
    color: 'white',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  prepTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingLeft: 10,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 15,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tipsBox: {
    backgroundColor: '#fff9c4',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbc02d',
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57f17',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#f57f17',
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

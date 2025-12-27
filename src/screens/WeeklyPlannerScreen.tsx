import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
} from 'react-native';
import { useAppStore } from '../store/appStore';
import { Recipe } from '../types/recipe';

interface WeeklyPlannerScreenProps {
  navigation: any;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const WeeklyPlannerScreen: React.FC<WeeklyPlannerScreenProps> = ({ navigation }) => {
  const { weeklyPlan, recipes, addRecipeToDay, removeRecipeFromDay } = useAppStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');

  const handleAddRecipe = (day: string) => {
    setSelectedDay(day);
    setModalVisible(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    addRecipeToDay(selectedDay, recipe);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Weekly Meal Planner</Text>
          <Text style={styles.subtitle}>
            Plan your meals and generate a shopping list
          </Text>

          {DAYS_OF_WEEK.map((day) => (
            <View key={day} style={styles.dayCard}>
              <Text style={styles.dayTitle}>{day}</Text>
              
              {weeklyPlan[day] && weeklyPlan[day].length > 0 ? (
                weeklyPlan[day].map((recipe) => (
                  <View key={recipe.recipeId} style={styles.recipeItem}>
                    <Text style={styles.recipeText}>{recipe.originalName}</Text>
                    <TouchableOpacity
                      onPress={() => removeRecipeFromDay(day, recipe.recipeId)}
                    >
                      <Text style={styles.removeButton}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No meals planned</Text>
              )}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddRecipe(day)}
              >
                <Text style={styles.addButtonText}>+ Add Meal</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Recipe</Text>
            
            {recipes.length === 0 ? (
              <Text style={styles.modalEmptyText}>
                No recipes available. Import some first!
              </Text>
            ) : (
              <FlatList
                data={recipes}
                keyExtractor={(item) => item.recipeId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectRecipe(item)}
                  >
                    <Text style={styles.modalItemText}>{item.originalName}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  dayCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  recipeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipeText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    fontSize: 20,
    color: '#f44336',
    paddingHorizontal: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalEmptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f44336',
    borderRadius: 6,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

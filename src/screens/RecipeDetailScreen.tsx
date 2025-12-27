import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe, VersionType } from '../types/recipe';
import { useAppStore } from '../store/appStore';

interface RecipeDetailScreenProps {
    recipe: Recipe;
    onBack: () => void;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ recipe, onBack }) => {
    const [selectedVersion, setSelectedVersion] = useState<VersionType>('student');
    const { planner, addToPlan } = useAppStore();

    const handleAddToPlan = () => {
        const dayOptions = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const slotOptions = ['Frühstück', 'Mittag', 'Abend'];

        Alert.alert(
            'Zum Plan hinzufügen',
            'Wähle Tag und Zeit',
            [
                { text: 'Abbrechen', style: 'cancel' },
                ...dayOptions.flatMap((day, dayIdx) =>
                    slotOptions.map((slot, slotIdx) => ({
                        text: `${day} - ${slot}`,
                        onPress: () => {
                            const slotKey = ['breakfast', 'lunch', 'dinner'][slotIdx] as 'breakfast' | 'lunch' | 'dinner';
                            addToPlan(dayIdx, slotKey, recipe.recipeId, selectedVersion);
                            Alert.alert('Erfolg', 'Rezept zum Plan hinzugefügt!');
                        }
                    }))
                )
            ],
            { cancelable: true }
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white border-b border-gray-200 px-4 pt-12 pb-4 flex-row items-center">
                <TouchableOpacity onPress={onBack} className="mr-4">
                    <Text className="text-chef-500 text-2xl">←</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900">Rezept-Details</Text>
            </View>

            <RecipeCard
                recipe={recipe}
                selectedVersion={selectedVersion}
                onVersionChange={setSelectedVersion}
                onAddToPlan={handleAddToPlan}
            />
        </View>
    );
};

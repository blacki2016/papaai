import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Recipe, VersionType } from '../types/recipe';

interface RecipeCardProps {
    recipe: Recipe;
    selectedVersion: VersionType;
    onVersionChange: (version: VersionType) => void;
    onAddToPlan?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    selectedVersion,
    onVersionChange,
    onAddToPlan
}) => {
    const version = recipe.versions[selectedVersion];

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    {recipe.originalName}
                </Text>
                <Text className="text-sm text-gray-500 mb-6">
                    {new Date(recipe.createdAt).toLocaleDateString('de-DE')}
                </Text>

                {/* Version Selector */}
                <View className="flex-row gap-2 mb-6">
                    {(['student', 'profi', 'airfryer'] as VersionType[]).map((v) => (
                        <TouchableOpacity
                            key={v}
                            onPress={() => onVersionChange(v)}
                            className={`flex-1 py-3 px-4 rounded-xl ${selectedVersion === v
                                    ? 'bg-chef-500'
                                    : 'bg-white border border-gray-200'
                                }`}
                        >
                            <Text
                                className={`text-center font-semibold text-sm ${selectedVersion === v ? 'text-white' : 'text-gray-700'
                                    }`}
                            >
                                {v === 'student'
                                    ? '🎓 Student'
                                    : v === 'profi'
                                        ? '👨‍🍳 Profi'
                                        : '🍳 Airfryer'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Version Details */}
                <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {version.title}
                    </Text>
                    <Text className="text-chef-600 font-medium mb-4">
                        ⏱️ {version.prepTime}
                        {version.calories && ` • ${version.calories} kcal`}
                    </Text>

                    {/* Ingredients */}
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                        Zutaten
                    </Text>
                    <View className="mb-6">
                        {version.ingredients.map((ing, idx) => (
                            <View
                                key={idx}
                                className="flex-row justify-between py-2 border-b border-gray-100"
                            >
                                <Text className="text-gray-700">{ing.item}</Text>
                                <Text className="text-gray-500">
                                    {ing.amount} {ing.unit}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Steps */}
                    <Text className="text-lg font-bold text-gray-900 mb-3">
                        Zubereitung
                    </Text>
                    <View className="mb-6">
                        {version.steps.map((step, idx) => (
                            <View key={idx} className="flex-row mb-4">
                                <View className="w-8 h-8 rounded-full bg-chef-500 items-center justify-center mr-3">
                                    <Text className="text-white font-bold">{idx + 1}</Text>
                                </View>
                                <Text className="flex-1 text-gray-700 leading-6">{step}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Tips */}
                    {version.tips && (
                        <View className="bg-chef-50 p-4 rounded-xl">
                            <Text className="text-sm font-bold text-chef-900 mb-1">
                                💡 Tipp
                            </Text>
                            <Text className="text-sm text-gray-700">{version.tips}</Text>
                        </View>
                    )}
                </View>

                {/* Add to Plan Button */}
                {onAddToPlan && (
                    <TouchableOpacity
                        onPress={onAddToPlan}
                        className="bg-chef-500 py-4 rounded-xl shadow-lg active:opacity-80"
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Zum Wochenplan hinzufügen
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

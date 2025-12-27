import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/appStore';

export const PlannerScreen: React.FC<{ onNavigate: (view: any, data?: any) => void }> = ({ onNavigate }) => {
    const { planner, recipes, removeFromPlan } = useAppStore();
    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const slotLabels = {
        breakfast: 'Frühstück',
        lunch: 'Mittag',
        dinner: 'Abend'
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4 pb-24">
                <Text className="text-2xl font-bold text-gray-900 mb-6">Wochenplan</Text>

                <View className="gap-4">
                    {planner.map((day, dayIdx) => (
                        <View key={dayIdx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <View className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex-row justify-between items-center">
                                <Text className="font-semibold text-gray-700">{days[dayIdx]}</Text>
                                <Text className="text-xs text-gray-400">
                                    {new Date(day.date).toLocaleDateString('de-DE')}
                                </Text>
                            </View>

                            <View>
                                {(['breakfast', 'lunch', 'dinner'] as const).map((slot) => {
                                    const slotData = day.slots[slot];
                                    const recipe = slotData ? recipes.find(r => r.recipeId === slotData.recipeId) : null;

                                    return (
                                        <View key={slot} className="flex-row items-center p-3 border-b border-gray-50">
                                            <Text className="text-xs uppercase font-bold text-gray-400 w-20">
                                                {slotLabels[slot]}
                                            </Text>
                                            {recipe ? (
                                                <View className="flex-1 flex-row justify-between items-center">
                                                    <TouchableOpacity
                                                        onPress={() => onNavigate('recipe-detail', { recipe })}
                                                        className="flex-1"
                                                    >
                                                        <Text className="text-sm font-medium text-gray-800">
                                                            {recipe.originalName}
                                                        </Text>
                                                        <Text className="text-xs text-chef-600 capitalize">
                                                            {slotData?.version ? `${slotData.version} Edition` : ''}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => removeFromPlan(dayIdx, slot)}
                                                        className="ml-2 p-2"
                                                    >
                                                        <Text className="text-red-500">🗑️</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <Text className="text-sm text-gray-300 italic">Leer</Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

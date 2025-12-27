import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/appStore';

export const ShoppingListScreen: React.FC = () => {
    const { shoppingList, toggleShoppingItem } = useAppStore();
    const categories = Array.from(new Set(shoppingList.map(i => i.category)));

    const openItems = shoppingList.filter(i => !i.checked).length;

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4 pb-24">
                <View className="flex-row justify-between items-end mb-6">
                    <Text className="text-2xl font-bold text-gray-900">Einkaufsliste</Text>
                    <Text className="text-sm text-gray-500">{openItems} Artikel offen</Text>
                </View>

                {shoppingList.length === 0 ? (
                    <View className="items-center py-20">
                        <Text className="text-6xl mb-4 opacity-20">🛒</Text>
                        <Text className="text-gray-400 text-center">
                            Deine Einkaufsliste ist leer.
                        </Text>
                        <Text className="text-sm text-gray-400 text-center mt-2">
                            Füge Rezepte zum Plan hinzu, um die Liste zu füllen.
                        </Text>
                    </View>
                ) : (
                    <View className="gap-6">
                        {categories.sort().map((category) => (
                            <View key={category}>
                                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    {category}
                                </Text>
                                <View className="bg-white rounded-xl shadow-sm border border-gray-100">
                                    {shoppingList.map((item, idx) => {
                                        if (item.category !== category) return null;

                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                onPress={() => toggleShoppingItem(idx)}
                                                className="flex-row items-center p-4 border-b border-gray-50"
                                            >
                                                <View className="mr-3">
                                                    <Text className={`text-xl ${item.checked ? 'text-chef-500' : 'text-gray-300'}`}>
                                                        {item.checked ? '✓' : '○'}
                                                    </Text>
                                                </View>
                                                <View className="flex-1">
                                                    <Text
                                                        className={`font-medium ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        {item.item}
                                                    </Text>
                                                </View>
                                                <Text
                                                    className={`font-medium ${item.checked ? 'text-gray-400' : 'text-gray-600'
                                                        }`}
                                                >
                                                    {item.amount} {item.unit}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

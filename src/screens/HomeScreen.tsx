import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '../store/appStore';
import { generateRecipe, generateRecipeFromImage } from '../services/aiService';
import { prepareImageForAI } from '../utils/imageUtils';

export const HomeScreen: React.FC<{ onNavigate: (view: any, data?: any) => void }> = ({ onNavigate }) => {
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Generiere Rezept...');
    const { recipes, addRecipe } = useAppStore();

    const handleGenerate = async (input: string, sourceType: 'text' | 'pantry' | 'ocr' | 'social') => {
        if (!input.trim()) return;

        setLoading(true);
        try {
            const recipe = await generateRecipe(input, sourceType);
            addRecipe(recipe);
            onNavigate('recipe-detail', { recipe });
        } catch (error) {
            Alert.alert('Fehler', 'Rezept konnte nicht generiert werden');
        } finally {
            setLoading(false);
        }
    };

    const handleCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Berechtigung erforderlich', 'Kamera-Zugriff wird benötigt');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            await handleImageRecipe(result.assets[0].uri, 'Erkenne Gericht aus Foto...');
        }
    };

    const handleImagePicker = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Berechtigung erforderlich', 'Galerie-Zugriff wird benötigt');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            await handleImageRecipe(result.assets[0].uri, 'Analysiere Speisekarte...');
        }
    };

    const handleImageRecipe = async (imageUri: string, message: string) => {
        setLoading(true);
        setLoadingMessage(message);
        
        try {
            // Prepare image (resize and convert to base64)
            setLoadingMessage('Bereite Bild vor...');
            const imageBase64 = await prepareImageForAI(imageUri);
            
            // Generate recipe from image
            setLoadingMessage('Generiere Rezept...');
            const recipe = await generateRecipeFromImage(
                imageBase64,
                'Analyze this image and create a recipe based on what you see.',
                'ocr'
            );
            
            addRecipe(recipe);
            onNavigate('recipe-detail', { recipe });
        } catch (error) {
            console.error('Image recipe error:', error);
            Alert.alert('Fehler', 'Rezept konnte nicht aus dem Bild generiert werden');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4 pb-24">
                {/* Header */}
                <Text className="text-3xl font-bold text-gray-900 mb-2">ChefMate</Text>
                <Text className="text-gray-600 mb-6">Dein KI-Küchenassistent</Text>

                {/* Search Bar */}
                <View className="mb-6">
                    <View className="flex-row gap-2">
                        <TextInput
                            value={searchInput}
                            onChangeText={setSearchInput}
                            placeholder="Rezept suchen..."
                            className="flex-1 bg-white px-4 py-3 rounded-xl border border-gray-200"
                        />
                        <TouchableOpacity
                            onPress={() => handleGenerate(searchInput, 'text')}
                            disabled={loading || !searchInput.trim()}
                            className="bg-chef-500 px-6 py-3 rounded-xl active:opacity-80"
                        >
                            <Text className="text-white font-bold">🔍</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Schnell-Import
                </Text>
                <View className="flex-row gap-3 mb-6">
                    <TouchableOpacity
                        onPress={handleCamera}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl items-center"
                    >
                        <Text className="text-3xl mb-2">📸</Text>
                        <Text className="text-white text-xs font-medium">Kamera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleImagePicker}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-2xl items-center"
                    >
                        <Text className="text-3xl mb-2">🖼️</Text>
                        <Text className="text-white text-xs font-medium">Speisekarte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Alert.prompt('Vorrat', 'Zutaten eingeben (mit Komma getrennt):', [
                                { text: 'Abbrechen', style: 'cancel' },
                                { text: 'Generieren', onPress: (text?: string) => text && handleGenerate(text, 'pantry') }
                            ]);
                        }}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl items-center"
                    >
                        <Text className="text-3xl mb-2">🥘</Text>
                        <Text className="text-white text-xs font-medium">Vorrat</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Recipes */}
                {recipes.length > 0 && (
                    <>
                        <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Verlauf
                        </Text>
                        <View className="gap-3">
                            {recipes.map((recipe) => (
                                <TouchableOpacity
                                    key={recipe.recipeId}
                                    onPress={() => onNavigate('recipe-detail', { recipe })}
                                    className="bg-white p-4 rounded-xl border border-gray-100 flex-row items-center justify-between"
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-12 h-12 rounded-full bg-chef-50 items-center justify-center">
                                            <Text className="text-chef-600 font-bold text-lg">
                                                {recipe.originalName.charAt(0)}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className="font-semibold text-gray-900">
                                                {recipe.originalName}
                                            </Text>
                                            <Text className="text-xs text-gray-500 capitalize">
                                                {recipe.sourceType} • {new Date(recipe.createdAt).toLocaleDateString('de-DE')}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-gray-300 text-xl">→</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {loading && (
                    <View className="mt-6 items-center bg-white p-6 rounded-2xl border border-gray-200">
                        <ActivityIndicator size="large" color="#FF6B35" />
                        <Text className="text-gray-700 mt-4 font-medium">{loadingMessage}</Text>
                        <Text className="text-gray-500 text-sm mt-2">Dies kann einen Moment dauern...</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

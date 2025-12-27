import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '../store/appStore';
import { aiService } from '../services/ai/aiService';
import { prepareImageForUpload, uriToBase64 } from '../utils/media';
import { isRecipeParseError } from '../utils/errors';

export const HomeScreen: React.FC<{ onNavigate: (view: any, data?: any) => void }> = ({ onNavigate }) => {
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState<string>('');
    const { recipes, addRecipe } = useAppStore();

    const run = async (fn: () => Promise<void>) => {
        setLoading(true);
        setStatusText('');
        try {
            await fn();
        } catch (error) {
            if (isRecipeParseError(error)) {
                Alert.alert('Fehler', 'Antwort konnte nicht verarbeitet werden (JSON). Bitte erneut versuchen.');
            } else {
                Alert.alert('Fehler', 'Rezept konnte nicht generiert werden');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateText = async () => {
        const input = searchInput.trim();
        if (!input) return;

        await run(async () => {
            const recipe = await aiService.generateRecipe(
                { type: 'text', content: input, sourceTypeHint: 'text' },
                setStatusText
            );
            addRecipe(recipe);
            onNavigate('recipe-detail', { recipe });
        });
    };

    const handleMenuScan = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Berechtigung erforderlich', 'Kamera-Zugriff wird benötigt');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (result.canceled) return;
        const asset = result.assets?.[0];
        if (!asset?.uri) return;

        await run(async () => {
            setStatusText('Bild wird vorbereitet...');
            const prepared = await prepareImageForUpload(asset.uri);
            const base64 = await uriToBase64(prepared.uri);

            const recipe = await aiService.generateRecipe(
                {
                    type: 'image',
                    mediaData: base64,
                    mimeType: prepared.mimeType,
                    sourceTypeHint: 'ocr',
                },
                setStatusText
            );
            addRecipe(recipe);
            onNavigate('recipe-detail', { recipe });
        });
    };

    const handlePantryScan = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Berechtigung erforderlich', 'Kamera-Zugriff wird benötigt');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });

        if (result.canceled) return;
        const asset = result.assets?.[0];
        if (!asset?.uri) return;

        await run(async () => {
            setStatusText('Bild wird vorbereitet...');
            const prepared = await prepareImageForUpload(asset.uri);
            const base64 = await uriToBase64(prepared.uri);

            const recipe = await aiService.generateRecipe(
                {
                    type: 'image',
                    mediaData: base64,
                    mimeType: prepared.mimeType,
                    sourceTypeHint: 'pantry',
                },
                setStatusText
            );
            addRecipe(recipe);
            onNavigate('recipe-detail', { recipe });
        });
    };

    const handleImportReel = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Berechtigung erforderlich', 'Galerie-Zugriff wird benötigt');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            quality: 1,
        });

        if (result.canceled) return;
        const asset = result.assets?.[0];
        if (!asset?.uri) return;

        await run(async () => {
            const recipe = await aiService.generateRecipe(
                { type: 'video', content: asset.uri, sourceTypeHint: 'social' },
                setStatusText
            );
            addRecipe(recipe);
            onNavigate('recipe-detail', { recipe });
        });
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
                            onPress={handleGenerateText}
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
                        onPress={handleMenuScan}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl items-center"
                    >
                        <Text className="text-3xl mb-2">📸</Text>
                        <Text className="text-white text-xs font-medium">Karte scannen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlePantryScan}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl items-center"
                    >
                        <Text className="text-3xl mb-2">🥘</Text>
                        <Text className="text-white text-xs font-medium">Kühlschrank</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleImportReel}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-2xl items-center"
                    >
                        <Text className="text-3xl mb-2">🔗</Text>
                        <Text className="text-white text-xs font-medium">Reel import</Text>
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
                    <View className="mt-6 items-center">
                        <Text className="text-gray-500">{statusText || 'Bitte warten...'} ⏳</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppView } from '../types/recipe';

interface NavigationProps {
    currentView: AppView;
    onNavigate: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
    return (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row">
            <TouchableOpacity
                onPress={() => onNavigate('home')}
                className={`flex-1 py-4 items-center ${currentView === 'home' ? 'border-t-2 border-chef-500' : ''
                    }`}
            >
                <Text className="text-2xl mb-1">🏠</Text>
                <Text
                    className={`text-xs font-semibold ${currentView === 'home' ? 'text-chef-500' : 'text-gray-400'
                        }`}
                >
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onNavigate('planner')}
                className={`flex-1 py-4 items-center ${currentView === 'planner' ? 'border-t-2 border-chef-500' : ''
                    }`}
            >
                <Text className="text-2xl mb-1">📅</Text>
                <Text
                    className={`text-xs font-semibold ${currentView === 'planner' ? 'text-chef-500' : 'text-gray-400'
                        }`}
                >
                    Planer
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onNavigate('shopping')}
                className={`flex-1 py-4 items-center ${currentView === 'shopping' ? 'border-t-2 border-chef-500' : ''
                    }`}
            >
                <Text className="text-2xl mb-1">🛒</Text>
                <Text
                    className={`text-xs font-semibold ${currentView === 'shopping' ? 'text-chef-500' : 'text-gray-400'
                        }`}
                >
                    Einkauf
                </Text>
            </TouchableOpacity>
        </View>
    );
};

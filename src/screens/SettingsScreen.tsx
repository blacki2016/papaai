import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppStore } from '../store/appStore';

export const SettingsScreen: React.FC = () => {
  const { apiKey, setApiKey } = useAppStore();
  const [inputKey, setInputKey] = useState('');

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    if (!inputKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    if (!inputKey.startsWith('sk-')) {
      Alert.alert(
        'Warning',
        'OpenAI API keys typically start with "sk-". Are you sure this is correct?'
      );
    }

    setApiKey(inputKey.trim());
    Alert.alert('Success', 'API key saved successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OpenAI API Configuration</Text>
            <Text style={styles.label}>API Key:</Text>
            <TextInput
              style={styles.input}
              placeholder="sk-..."
              value={inputKey}
              onChangeText={setInputKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>
              Your API key is stored locally and never shared
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save API Key</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🔑 How to get an API Key:</Text>
            <Text style={styles.infoItem}>
              1. Go to platform.openai.com
            </Text>
            <Text style={styles.infoItem}>
              2. Sign up or log in
            </Text>
            <Text style={styles.infoItem}>
              3. Navigate to API Keys section
            </Text>
            <Text style={styles.infoItem}>
              4. Create a new secret key
            </Text>
            <Text style={styles.infoItem}>
              5. Copy and paste it here
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>⚠️ Important:</Text>
            <Text style={styles.warningText}>
              Using the OpenAI API will incur costs based on usage. Make sure to
              monitor your usage and set up billing limits in your OpenAI account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>
              ChefMate - AI-Powered Adaptive Recipe App
            </Text>
            <Text style={styles.aboutText}>Version 1.0.0</Text>
            <Text style={styles.aboutText}>
              Generate three versions of any recipe: Student, Airfryer, and Profi
            </Text>
          </View>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

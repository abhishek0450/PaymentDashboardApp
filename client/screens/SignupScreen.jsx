import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext'; 

export default function SignupScreen({ navigation }) {
  const { theme } = useContext(ThemeContext); 
  const styles = getStyles(theme); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (username.length < 4 || password.length < 6) {
      Alert.alert('Error', 'Username must be at least 4 characters and password at least 6.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/users', { username, password });
      Alert.alert('Success', 'Account created successfully! Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Signup Failed', 'Username may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create a New Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={theme === 'light' ? '#999' : '#777'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme === 'light' ? '#999' : '#777'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignup} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
  },
  input: {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f',
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ddd' : '#333',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme === 'light' ? '#6200ee' : '#bb86fc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: theme === 'light' ? '#ffffff' : '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
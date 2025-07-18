import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode'; 

export default function LoginScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and password are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token } = response.data;
      
      await SecureStore.setItemAsync('jwt', access_token);
      
      
      const decodedToken = jwtDecode(access_token);
      
     
      if (decodedToken.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else {
        navigation.replace('Dashboard');
      }

    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Welcome Back!</Text>
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
        onPress={handleLogin} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
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
  signupText: {
    color: theme === 'light' ? '#6200ee' : '#bb86fc',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});
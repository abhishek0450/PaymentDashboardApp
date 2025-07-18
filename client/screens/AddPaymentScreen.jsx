import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext'; 

const STATUS_OPTIONS = ['success', 'pending', 'failed'];

export default function AddPaymentScreen({ navigation }) {
  const { theme } = useContext(ThemeContext); 
  const styles = getStyles(theme); 

  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleAddPayment = async () => {
    if (!amount || !receiver || !method) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/payments', {
        amount: parseFloat(amount),
        receiver,
        status,
        method,
      });
      navigation.navigate('Dashboard', { refresh: true });
    } catch (error) {
      Alert.alert('Error', 'Could not add payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Add Payment</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="$50.00"
          placeholderTextColor={theme === 'light' ? '#999' : '#777'}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Receiver</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., John Doe"
          placeholderTextColor={theme === 'light' ? '#999' : '#777'}
          value={receiver}
          onChangeText={setReceiver}
        />

        <Text style={styles.label}>Payment Method</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Credit Card"
          placeholderTextColor={theme === 'light' ? '#999' : '#777'}
          value={method}
          onChangeText={setMethod}
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          {STATUS_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.statusButton,
                status === option && styles.activeStatusButton,
              ]}
              onPress={() => setStatus(option)}
            >
              <Text style={[styles.statusText, status === option && styles.activeStatusText]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleAddPayment} 
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Confirm Payment'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  form: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'light' ? '#333' : '#e0e0e0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f',
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ddd' : '#333',
    fontSize: 16,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme === 'light' ? '#ddd' : '#333',
    backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f',
    alignItems: 'center',
  },
  activeStatusButton: {
    backgroundColor: theme === 'light' ? '#e8e4f2' : '#3c305c',
    borderColor: theme === 'light' ? '#6200ee' : '#bb86fc',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme === 'light' ? '#333' : '#e0e0e0',
    textTransform: 'capitalize',
  },
  activeStatusText: {
    color: theme === 'light' ? '#6200ee' : '#bb86fc',
  },
  submitButton: {
    backgroundColor: theme === 'light' ? '#6200ee' : '#bb86fc',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    marginTop: 10,
  },
  submitButtonText: {
    color: theme === 'light' ? '#ffffff' : '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
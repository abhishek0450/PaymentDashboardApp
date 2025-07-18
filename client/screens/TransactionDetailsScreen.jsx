import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'success': return '#28a745';
    case 'failed': return '#dc3545';
    case 'pending': return '#ffc107';
    default: return '#6c757d';
  }
};

export default function TransactionDetailsScreen({ route }) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const DetailRow = ({ label, value, valueColor }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, { color: valueColor || styles.detailValue.color }]}>{value}</Text>
    </View>
  );

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await api.get(`/payments/${transactionId}`);
        setTransaction(response.data);
      } catch (error) {
        console.error("Failed to fetch transaction details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color={theme === 'light' ? '#6200ee' : '#bb86fc'} /></View>;
  }

  if (!transaction) {
    return <View style={styles.loaderContainer}><Text style={styles.errorText}>Transaction not found.</Text></View>;
  }

  return (
    
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.amountText}>${transaction.amount.toFixed(2)}</Text>
        <Text style={styles.receiverText}>Paid to {transaction.receiver}</Text>
      </View>
      
     
      <ScrollView>
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Transaction Details</Text>
          <DetailRow label="Payment Method" value={transaction.method} />
          <DetailRow
            label="Status"
            value={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            valueColor={getStatusColor(transaction.status)}
          />
          <DetailRow label="Date" value={new Date(transaction.date).toLocaleDateString()} />
          <DetailRow label="Time" value={new Date(transaction.date).toLocaleTimeString()} />
          <DetailRow label="Transaction ID" value={transaction._id} />
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: theme === 'light' ? '#6c757d' : '#b0b0b0',
  },
  headerSection: {
    backgroundColor: theme === 'light' ? '#6200ee' : '#1f1f1f',
    padding: 24,
    alignItems: 'center',
 
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  receiverText: {
    fontSize: 18,
    color: theme === 'light' ? '#e8e4f2' : '#b0b0b0',
    marginTop: 8,
  },
  detailsCard: {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    marginTop: 30, 
    elevation: 5, 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#eeeeee' : '#333333',
    paddingBottom: 10,
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 16,
    color: theme === 'light' ? '#6c757d' : '#b0b0b0',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
    flexShrink: 1,
    textAlign: 'right'
  },
});
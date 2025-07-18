import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const getStatusColor = (status) => {
  switch (status) {
    case 'success': return '#28a745';
    case 'failed': return '#dc3545';
    case 'pending': return '#ffc107';
    default: return '#6c757d';
  }
};

const getMethodIcon = (method) => {
  if (method?.toLowerCase().includes('card')) return '💳';
  if (method?.toLowerCase().includes('upi')) return '🅿️';
  if (method?.toLowerCase().includes('bank')) return '🏦';
  return '💵';
};

export default function TransactionCard({ transaction, onPress }) {
  const statusColor = getStatusColor(transaction.status);
  const methodIcon = getMethodIcon(transaction.method);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{methodIcon}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.receiverText}>To: {transaction.receiver}</Text>
        <Text style={styles.dateText}>{new Date(transaction.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>${transaction.amount.toFixed(2)}</Text>
        <Text style={[styles.statusText, { color: statusColor }]}>{transaction.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    backgroundColor: '#f4f5f7',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  detailsContainer: {
    flex: 1,
  },
  receiverText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  dateText: {
    fontSize: 14,
    color: '#6c6c6c',
    marginTop: 4,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginTop: 4,
  },
});
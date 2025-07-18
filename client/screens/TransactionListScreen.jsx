import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, Button } from 'react-native';
import api from '../services/api';
import TransactionCard from './TransactionCard';
import TransactionFilterHeader from '../components/TransactionFilterHeader';
import { ThemeContext } from '../context/ThemeContext';

export default function TransactionListScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
      status: 'all',
      method: '',
      dateRange: { start: null, end: null }
  });

  const fetchTransactions = useCallback(async (currentPage, filters) => {
    if (currentPage === 1) {
      setIsFiltering(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = {
        status: filters.status === 'all' ? undefined : filters.status,
        method: filters.method || undefined,
        startDate: filters.dateRange.start?.toISOString(),
        endDate: filters.dateRange.end?.toISOString(),
        page: currentPage,
        limit: 10,
      };
      const response = await api.get('/payments', { params });
      const { data, hasNextPage: newHasNextPage } = response.data;

      setTransactions(prev => currentPage === 1 ? data : [...prev, ...data]);
      setHasNextPage(newHasNextPage);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsFiltering(false);
    }
  }, []);
  
  useEffect(() => {
    setLoading(true);
    fetchTransactions(1, currentFilters);
  }, []);

  const handleApplyFilters = (filters) => {
    setPage(1);
    setCurrentFilters(filters);
    fetchTransactions(1, filters);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactions(nextPage, currentFilters);
    }
  };

  const renderFooter = () => {
    if (loadingMore) return <ActivityIndicator style={{ marginVertical: 20 }} color={theme === 'light' ? '#6200ee' : '#bb86fc'} />;
    if (hasNextPage) return <View style={styles.footerButtonContainer}><Button title="Load More" onPress={handleLoadMore} color={theme === 'light' ? '#6200ee' : '#bb86fc'} /></View>;
    return null;
  };

  if (loading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color={theme === 'light' ? '#6200ee' : '#bb86fc'} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TransactionCard 
            transaction={item} 
            onPress={() => navigation.navigate('TransactionDetails', { transactionId: item._id })}
          />
        )}
        ListHeaderComponent={
            <TransactionFilterHeader 
                onApplyFilters={handleApplyFilters} 
                isFiltering={isFiltering}
            />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found for these filters.</Text>}
      />
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
  footerButtonContainer: { margin: 20, marginBottom: 60 },
});
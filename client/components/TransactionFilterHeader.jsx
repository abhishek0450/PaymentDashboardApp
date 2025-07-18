import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, ActivityIndicator } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemeContext } from '../context/ThemeContext';

const STATUS_FILTERS = ['all', 'success', 'failed', 'pending'];

export default function TransactionFilterHeader({ onApplyFilters, isFiltering }) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [activeStatus, setActiveStatus] = useState('all');
  const [method, setMethod] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('start');

  const handleApply = () => {
    onApplyFilters({ status: activeStatus, method, dateRange });
  };

  const handleClear = () => {
    setActiveStatus('all');
    setMethod('');
    setDateRange({ start: null, end: null });
    onApplyFilters({ status: 'all', method: '', dateRange: { start: null, end: null } });
  };

  const showDatePicker = (mode) => {
    setDatePickerMode(mode);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date) => {
    setDateRange(prev => ({ ...prev, [datePickerMode]: date }));
    hideDatePicker();
  };

  return (
    <View>
        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
        />
        <Text style={styles.headerTitle}>Transactions</Text>
      
        <View style={styles.filterContainer}>
            {STATUS_FILTERS.map(filter => (
            <TouchableOpacity
                key={filter}
                style={[styles.filterButton, activeStatus === filter && styles.activeFilter]}
                onPress={() => setActiveStatus(filter)}
                disabled={isFiltering}
            >
                <Text style={[styles.filterText, activeStatus === filter && styles.activeFilterText]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
            </TouchableOpacity>
            ))}
        </View>

        <View style={styles.advancedFilterContainer}>
            <TextInput
            style={styles.input}
            placeholder="Filter by Payment Method"
            placeholderTextColor={theme === 'light' ? '#999' : '#777'}
            value={method}
            onChangeText={setMethod}
            />
            <View style={styles.dateFilterRow}>
            <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('start')}>
                <Text style={styles.dateButtonText}>{dateRange.start ? dateRange.start.toLocaleDateString() : 'Start Date'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateButton} onPress={() => showDatePicker('end')}>
                <Text style={styles.dateButtonText}>{dateRange.end ? dateRange.end.toLocaleDateString() : 'End Date'}</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.applyButtonRow}>
                <Button title="Apply Filters" onPress={handleApply} color={theme === 'light' ? '#6200ee' : '#bb86fc'} disabled={isFiltering} />
                <Button title="Clear" onPress={handleClear} color="#888" disabled={isFiltering} />
            </View>
        </View>
        {isFiltering && <ActivityIndicator style={{ marginVertical: 20 }} color={theme === 'light' ? '#6200ee' : '#bb86fc'} />}
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: theme === 'light' ? '#1a1a1a' : '#ffffff', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: theme === 'light' ? '#e9ecef' : '#2a2a2a' },
  activeFilter: { backgroundColor: theme === 'light' ? '#6200ee' : '#bb86fc' },
  filterText: { color: theme === 'light' ? '#495057' : '#e0e0e0', fontWeight: '600' },
  activeFilterText: { color: theme === 'light' ? '#ffffff' : '#121212' },
  advancedFilterContainer: { paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: theme === 'light' ? '#e0e0e0' : '#2a2a2a', paddingTop: 15, marginBottom: 10 },
  input: { backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f', color: theme === 'light' ? '#1a1a1a' : '#ffffff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: theme === 'light' ? '#ddd' : '#333', fontSize: 16, marginBottom: 15 },
  dateFilterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dateButton: { flex: 1, padding: 12, backgroundColor: theme === 'light' ? '#e9ecef' : '#2a2a2a', borderRadius: 12, alignItems: 'center', marginHorizontal: 5 },
  dateButtonText: { color: theme === 'light' ? '#495057' : '#e0e0e0', fontWeight: '600' },
  applyButtonRow: { flexDirection: 'row', justifyContent: 'space-around' },
});
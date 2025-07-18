import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const MetricCard = ({ title, value, styles }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const PIE_CHART_COLORS = {
  success: '#28a745',
  pending: '#ffc107',
  failed: '#dc3545',
};

export default function AdminDashboardScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Add the handleLogout function
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('jwt');
        navigation.replace('Login');
    };

    const fetchData = useCallback(async () => {
        try {
            const [statsResponse, usersResponse, chartResponse] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users'),
                api.get('/admin/stats/chart'),
            ]);
            setStats(statsResponse.data);
            setUsers(usersResponse.data);

            if (chartResponse.data.labels && chartResponse.data.datasets) {
              const formattedData = chartResponse.data.labels.map((label, index) => ({
                name: label,
                population: chartResponse.data.datasets[0].data[index],
                color: PIE_CHART_COLORS[label.toLowerCase()],
                legendFontColor: theme === 'light' ? '#7F7F7F' : '#FFFFFF',
                legendFontSize: 14,
              }));
              setPieChartData(formattedData);
            }
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    }, [theme]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                    <Text style={{ color: '#dc3545', fontSize: 16, fontWeight: 'bold' }}>Log Out</Text>
                </TouchableOpacity>
            ),
            headerLeft: () => null, 
            title: 'Admin Dashboard'
        });

        fetchData();
    }, [fetchData, navigation]);

    const handleDeleteUser = (userId) => {
        Alert.alert( "Delete User", "Are you sure you want to delete this user?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: async () => {
                    try {
                        await api.delete(`/users/${userId}`);
                        Alert.alert("Success", "User deleted successfully.");
                        fetchData();
                    } catch (error) {
                        Alert.alert("Error", "Failed to delete user.");
                    }
                }}
            ]
        );
    };
    
    const renderListHeader = () => (
        <>
            <Text style={styles.headerTitle}>Admin Overview</Text>
            <View style={styles.metricsContainer}>
                <MetricCard styles={styles} title="Total Users" value={stats?.totalUsers ?? '0'} />
                <MetricCard styles={styles} title="Total Revenue" value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`} />
            </View>
            <View style={styles.metricsContainer}>
                <MetricCard styles={styles} title="Total Transactions" value={stats?.totalTransactions ?? '0'} />
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>Transactions by Status</Text>
                <PieChart
                    data={pieChartData}
                    width={Dimensions.get("window").width - 32}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    absolute
                />
            </View>

            <Text style={styles.sectionTitle}>User Management</Text>
        </>
    );

    if (loading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" color={theme === 'light' ? '#6200ee' : '#bb86fc'} /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item._id.toString()}
                ListHeaderComponent={renderListHeader}
                renderItem={({ item }) => (
                    <View style={styles.userCard}>
                        <View>
                            <Text style={styles.userName}>{item.username}</Text>
                            <Text style={styles.userRole}>Role: {item.role}</Text>
                        </View>
                        {item.role !== 'admin' && (
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item._id)}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === 'light' ? '#f4f5f7' : '#121212' },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: theme === 'light' ? '#1a1a1a' : '#ffffff', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
    metricsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 16, },
    metricCard: { backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f', padding: 20, borderRadius: 16, flex: 1, marginHorizontal: 8, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, },
    metricTitle: { fontSize: 16, color: theme === 'light' ? '#6c6c6c' : '#b0b0b0', fontWeight: '600', marginBottom: 8, },
    metricValue: { fontSize: 28, fontWeight: 'bold', color: theme === 'light' ? '#1a1a1a' : '#ffffff', },
    chartContainer: { backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f', borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 20, elevation: 4, alignItems: 'center' },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme === 'light' ? '#1a1a1a' : '#ffffff', marginBottom: 10, paddingHorizontal: 16, },
    userCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 2, marginHorizontal: 16, },
    userName: { fontSize: 16, fontWeight: 'bold', color: theme === 'light' ? '#1a1a1a' : '#ffffff' },
    userRole: { fontSize: 14, color: theme === 'light' ? '#6c6c6c' : '#b0b0b0', marginTop: 4, textTransform: 'capitalize' },
    deleteButton: { backgroundColor: '#dc3545', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    deleteButtonText: { color: '#ffffff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#888' }
});
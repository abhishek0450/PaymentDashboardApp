import  { useEffect, useState, useCallback, useContext } from 'react';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Switch 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { LineChart } from 'react-native-chart-kit';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext'; 


const MetricCard = ({ title, value, styles }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const initialChartData = {
  labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
};

export default function DashboardScreen({ navigation, route }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const styles = getStyles(theme);
  const chartConfig = getChartConfig(theme);

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(initialChartData);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('jwt');
    navigation.replace('Login');
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsResponse, chartResponse, profileResponse] = await Promise.all([
        api.get('/payments/stats'),
        api.get('/payments/stats/chart'),
        api.get('/users/profile')
      ]);

      setStats(statsResponse.data);
      if (chartResponse.data.labels && chartResponse.data.labels.length > 0) {
        setChartData(chartResponse.data);
      } else {
        setChartData(initialChartData);
      }
      if (profileResponse.data.username) {
        setUserName(profileResponse.data.username);
      }

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'Dashboard',
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
           <Text style={{ color: '#ffffff',backgroundColor: '#ac2525ff',padding: 2,paddingHorizontal:8,borderRadius: 12, fontSize: 14 }}>LogOut</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => null,
    });
    
    fetchDashboardData();
  }, [navigation, fetchDashboardData]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchDashboardData();
    }
  }, [route.params?.refresh, fetchDashboardData]);


  if (loading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color={theme === 'light' ? '#6200ee' : '#bb86fc'} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {userName ? `${userName}'s Dashboard` : 'Welcome'}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleTheme}
          value={theme === 'dark'}
        />
      </View>
      
      <View style={styles.metricsContainer}>
        <MetricCard styles={styles} title="Total Revenue" value={stats ? `$${stats.totalRevenue.toFixed(2)}` : '$0.00'} />
        <MetricCard styles={styles} title="Payments Today" value={stats ? stats.totalPaymentsToday : 0} />
      </View>
      <View style={styles.metricsContainer}>
        <MetricCard styles={styles} title="This Week" value={stats ? stats.totalPaymentsThisWeek : 0} />
        <MetricCard styles={styles} title="Failed" value={stats ? stats.failedTransactions : 0} />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Revenue (Last 7 Days)</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddPayment')}>
          <Text style={styles.actionButtonText}>+ Add Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => navigation.navigate('Transactions')}>
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View All Transactions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Function to generate dynamic chart config
const getChartConfig = (theme) => ({
  backgroundGradientFrom: theme === 'light' ? '#ffffff' : '#1f1f1f',
  backgroundGradientTo: theme === 'light' ? '#ffffff' : '#1f1f1f',
  color: (opacity = 1) => theme === 'light' ? `rgba(98, 0, 238, ${opacity})` : `rgba(187, 134, 252, ${opacity})`,
  strokeWidth: 3,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: theme === 'light' ? "#6200ee" : "#bb86fc"
  }
});


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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
    textTransform: 'capitalize'
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f',
    padding: 20,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  metricTitle: {
    fontSize: 16,
    color: theme === 'light' ? '#6c6c6c' : '#b0b0b0',
    fontWeight: '600',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
  },
  chartContainer: {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1f1f1f',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme === 'light' ? '#1a1a1a' : '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  actionsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  actionButton: {
    backgroundColor: theme === 'light' ? '#6200ee' : '#bb86fc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  actionButtonText: {
    color: theme === 'light' ? '#ffffff' : '#121212',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: theme === 'light' ? '#e8e4f2' : '#2a2a2a',
  },
  secondaryButtonText: {
    color: theme === 'light' ? '#6200ee' : '#bb86fc',
  },
});
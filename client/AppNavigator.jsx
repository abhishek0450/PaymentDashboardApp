import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeContext } from './context/ThemeContext'; 
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TransactionListScreen from './screens/TransactionListScreen';
import AddPaymentScreen from './screens/AddPaymentScreen';
import TransactionDetailsScreen from './screens/TransactionDetailsScreen';
import SignupScreen from './screens/SignupScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { theme } = React.useContext(ThemeContext);

  const screenOptions = {
    headerStyle: { 
      backgroundColor: theme === 'light' ? '#6200ee' : '#1f1f1f',
    },
    headerTintColor: '#ffffff',
  };

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Payment App Login' }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Payment App Signup' }} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Transactions" component={TransactionListScreen} options={{ title: 'All Transactions' }} />
          <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} options={{ title: 'Transaction Details' }} />
          <Stack.Screen name="AddPayment" component={AddPaymentScreen} options={{ title: 'Add New Payment' }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default AppNavigator;
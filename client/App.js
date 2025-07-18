import 'react-native-gesture-handler';
import AppNavigator from './AppNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator/>
    </ThemeProvider>
  );
}
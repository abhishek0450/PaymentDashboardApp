import React, { createContext, useState, useMemo, useEffect } from 'react';
import { Appearance } from 'react-native';
import * as SystemUI from 'expo-system-ui'; 


export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() || 'light');


  useEffect(() => {
    const backgroundColor = theme === 'light' ? '#f4f5f7' : '#121212';
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [theme]);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
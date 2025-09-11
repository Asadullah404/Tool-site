import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'red';

interface ThemeContextType {
  theme: Theme;
  themeColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColor = localStorage.getItem('themeColor') as ThemeColor;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setThemeColor(savedColor);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
    
    // Apply theme color
    const colorMap = {
      blue: '262 83% 58%',
      purple: '280 89% 60%',
      green: '142 71% 45%',
      orange: '25 95% 53%',
      red: '0 84% 60%'
    };
    
    document.documentElement.style.setProperty('--primary', colorMap[themeColor]);
    localStorage.setItem('themeColor', themeColor);
  }, [theme, themeColor]);

  return (
    <ThemeContext.Provider value={{ theme, themeColor, setTheme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
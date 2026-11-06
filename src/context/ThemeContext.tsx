import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeContextValue } from '../types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('mcourses_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('mcourses_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'light',
      toggleTheme: () => {},
    };
  }
  return ctx;
};

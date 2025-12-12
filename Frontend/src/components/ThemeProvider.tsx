import React, { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useUIStore();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Appliquer/retirer la classe dark
    if (darkMode) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      body.style.backgroundColor = '#0F0F0F';
      body.style.color = '#FFFFFF';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      body.style.backgroundColor = '#F5F5F5';
      body.style.color = '#1F1F1F';
    }
  }, [darkMode]);

  return <>{children}</>;
};


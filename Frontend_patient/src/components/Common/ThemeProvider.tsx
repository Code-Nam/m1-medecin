import React, { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { darkMode } = useUIStore();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    
    // Appliquer/retirer la classe dark
    if (darkMode) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
      body.style.backgroundColor = '#0F0F0F';
      body.style.color = '#FFFFFF';
      if (root) {
        root.style.backgroundColor = '#0F0F0F';
        root.style.color = '#FFFFFF';
      }
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
      body.style.backgroundColor = '#FCFCF7';
      body.style.color = '#263238';
      if (root) {
        root.style.backgroundColor = '#FCFCF7';
        root.style.color = '#263238';
      }
    }
  }, [darkMode]);

  return <>{children}</>;
};


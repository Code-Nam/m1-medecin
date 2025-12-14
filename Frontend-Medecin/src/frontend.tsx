import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const initializeTheme = () => {
  const htmlElement = document.documentElement;
  htmlElement.classList.remove('dark');
  htmlElement.style.colorScheme = 'light';
  document.body.style.backgroundColor = '#F5F5F5';
  document.body.style.color = '#1F1F1F';
  
  const stored = localStorage.getItem('ui-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const darkMode = parsed?.state?.darkMode ?? false;
      if (darkMode) {
        htmlElement.classList.add('dark');
        htmlElement.style.colorScheme = 'dark';
        document.body.style.backgroundColor = '#0F0F0F';
        document.body.style.color = '#FFFFFF';
        console.log('🌙 Dark mode activé depuis localStorage');
      } else {
        htmlElement.classList.remove('dark');
        htmlElement.style.colorScheme = 'light';
        document.body.style.backgroundColor = '#F5F5F5';
        document.body.style.color = '#1F1F1F';
        console.log('☀️ Light mode activé depuis localStorage');
      }
    } catch (e) {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#F5F5F5';
      document.body.style.color = '#1F1F1F';
      console.log('☀️ Light mode par défaut (erreur localStorage)');
    }
  } else {
    htmlElement.classList.remove('dark');
    htmlElement.style.colorScheme = 'light';
    document.body.style.backgroundColor = '#F5F5F5';
    document.body.style.color = '#1F1F1F';
    console.log('☀️ Light mode par défaut (pas de localStorage)');
  }
};

initializeTheme();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

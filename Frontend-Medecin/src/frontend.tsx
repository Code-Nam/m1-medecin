import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Initialiser le thème au chargement - FORCER le thème clair par défaut
const initializeTheme = () => {
  // TOUJOURS commencer par retirer la classe dark pour forcer le thème clair
  const htmlElement = document.documentElement;
  htmlElement.classList.remove('dark');
  htmlElement.style.colorScheme = 'light';
  document.body.style.backgroundColor = '#F5F5F5';
  document.body.style.color = '#1F1F1F';
  
  // Ensuite, vérifier le localStorage et appliquer si nécessaire
  const stored = localStorage.getItem('ui-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Zustand persist stocke dans { state: { ... } }
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
      // Si erreur, utiliser le thème clair par défaut
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#F5F5F5';
      document.body.style.color = '#1F1F1F';
      console.log('☀️ Light mode par défaut (erreur localStorage)');
    }
  } else {
    // Pas de localStorage, thème clair par défaut
    htmlElement.classList.remove('dark');
    htmlElement.style.colorScheme = 'light';
    document.body.style.backgroundColor = '#F5F5F5';
    document.body.style.color = '#1F1F1F';
    console.log('☀️ Light mode par défaut (pas de localStorage)');
  }
};

// Initialiser AVANT tout rendu React
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

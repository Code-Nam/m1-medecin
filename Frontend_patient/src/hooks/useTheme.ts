import { useUIStore } from '../store/uiStore';

export const useTheme = () => {
  const { darkMode } = useUIStore();
  
  return {
    darkMode,
    colors: {
      bg: {
        primary: darkMode ? '#0F0F0F' : '#FCFCF7', /* Fond - Palette IIM */
        secondary: darkMode ? '#1E1E1E' : '#FFFFFF', /* Cartes - Palette IIM - Variante sombre basée sur #263238 assombri */
        card: darkMode ? '#2A2A2A' : '#FFFFFF', /* Cartes - Palette IIM - Variante sombre basée sur #263238 assombri */
        sidebar: darkMode ? '#1E1E1E' : '#FFFFFF', /* Sidebar - Même que secondary */
        header: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)', /* Header */
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#263238', /* Couleur Texte - Palette IIM */
        secondary: darkMode ? '#B0BEC5' : '#546E7A', /* Texte secondaire - Palette IIM */
        muted: darkMode ? '#90A4AE' : '#78909C', /* Texte muted - Palette IIM */
      },
      border: {
        default: darkMode ? 'rgba(224, 224, 224, 0.15)' : '#E0E0E0', /* Bordures - Palette IIM - Variante sombre de #E0E0E0 avec transparence */
        light: darkMode ? 'rgba(224, 224, 224, 0.08)' : '#F3F4F6',
      },
      accent: {
        primary: darkMode ? '#4DB6AC' : '#43A78B', /* Couleur secondaire (teal) - Palette IIM */
        hover: darkMode ? '#26A69A' : '#2E7D6B', /* Hover */
        accent1: darkMode ? '#FFD54F' : '#FFE082', /* Accentuation 1 (jaune) - Palette IIM */
        accent2: darkMode ? '#EF5350' : '#E63946', /* Accentuation 2 (rouge) - Palette IIM */
      },
      semantic: {
        danger: darkMode ? '#EF5350' : '#E63946', /* Danger - Palette IIM */
        success: darkMode ? '#4DB6AC' : '#43A78B', /* Success - Palette IIM */
        warning: darkMode ? '#FFD54F' : '#FFE082', /* Warning - Palette IIM */
      }
    }
  };
};


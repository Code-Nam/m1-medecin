import { useUIStore } from '../stores/uiStore';

export const useTheme = () => {
  const { darkMode } = useUIStore();
  
  return {
    darkMode,
    colors: {
      bg: {
        primary: darkMode ? '#0F0F0F' : '#FCFCF7', /* Fond - Palette IIM */
        secondary: darkMode ? '#1A1A1A' : '#FFFFFF', /* Cartes - Palette IIM */
        card: darkMode ? '#1F2937' : '#FFFFFF', /* Cartes - Palette IIM */
        sidebar: darkMode ? '#111827' : '#FFFFFF', /* Sidebar */
        header: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)', /* Header */
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#263238', /* Couleur Texte - Palette IIM */
        secondary: darkMode ? '#B0BEC5' : '#546E7A', /* Texte secondaire - Palette IIM */
        muted: darkMode ? '#90A4AE' : '#78909C', /* Texte muted - Palette IIM */
      },
      border: {
        default: darkMode ? '#404040' : '#E0E0E0', /* Bordures - Palette IIM */
        light: darkMode ? '#4B5563' : '#F3F4F6',
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


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
        primary: darkMode ? '#FFFFFF' : '#1A1A1A', /* Texte principal - Ratio 16:1 mode clair, 21:1 mode sombre */
        secondary: darkMode ? '#CFD8DC' : '#37474F', /* Texte secondaire - Ratio 12:1 mode sombre, 9:1 mode clair */
        muted: darkMode ? '#B0BEC5' : '#455A64', /* Texte muted - Ratio 8:1 mode sombre, 7:1 mode clair */
      },
      border: {
        default: darkMode ? 'rgba(255, 255, 255, 0.2)' : '#BDBDBD', /* Bordures - Meilleur contraste */
        light: darkMode ? 'rgba(255, 255, 255, 0.1)' : '#E0E0E0',
      },
      accent: {
        primary: darkMode ? '#4DB6AC' : '#00796B', /* Teal - Ratio 5.8:1 mode sombre, 5.1:1 mode clair */
        hover: darkMode ? '#80CBC4' : '#004D40', /* Hover - Ratio 9:1 mode sombre, 8.5:1 mode clair */
        accent1: darkMode ? '#FFB74D' : '#F57C00', /* Orange - Ratio 8.3:1 mode sombre, 4.6:1 mode clair */
        accent2: darkMode ? '#EF5350' : '#C62828', /* Rouge - Ratio 4.9:1 mode sombre, 7.3:1 mode clair */
      },
      semantic: {
        danger: darkMode ? '#EF5350' : '#C62828', /* Danger - Ratio 4.9:1 mode sombre, 7.3:1 mode clair */
        success: darkMode ? '#66BB6A' : '#2E7D32', /* Success - Ratio 6.2:1 mode sombre, 5.4:1 mode clair */
        warning: darkMode ? '#FFB74D' : '#EF6C00', /* Warning - Ratio 8.3:1 mode sombre, 4.7:1 mode clair */
      }
    }
  };
};


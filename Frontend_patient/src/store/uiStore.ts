import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        const currentMode = get().darkMode;
        const newDarkMode = !currentMode;
        console.log(`🔄 Toggle dark mode: ${currentMode} → ${newDarkMode}`);
        set({ darkMode: newDarkMode });
        const htmlElement = document.documentElement;
        const body = document.body;
        const root = document.getElementById('root');
        
        if (newDarkMode) {
          htmlElement.classList.add('dark');
          htmlElement.style.colorScheme = 'dark';
          body.style.backgroundColor = '#0F0F0F';
          body.style.color = '#FFFFFF';
          if (root) {
            root.style.backgroundColor = '#0F0F0F';
            root.style.color = '#FFFFFF';
          }
          console.log('🌙 Dark mode activé avec styles inline');
        } else {
          htmlElement.classList.remove('dark');
          htmlElement.style.colorScheme = 'light';
          body.style.backgroundColor = '#FCFCF7';
          body.style.color = '#263238';
          if (root) {
            root.style.backgroundColor = '#FCFCF7';
            root.style.color = '#263238';
          }
          console.log('☀️ Light mode activé avec styles inline');
        }
      },
      sidebarCollapsed: false,
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ darkMode: state.darkMode })
    }
  )
);


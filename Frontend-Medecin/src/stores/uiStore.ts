import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ModalType = 'createAppointment' | 'editAppointment' | 'deleteAppointment' | 
                 'createPatient' | 'editPatient' | 'patientDetail' | null;

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface UIState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Modals
  activeModal: ModalType;
  modalData: any;
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  
  // Loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Current page title
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme - false = light mode par défaut
      darkMode: false,
      toggleDarkMode: () => {
        const currentMode = get().darkMode;
        const newDarkMode = !currentMode;
        console.log(`🔄 Toggle dark mode: ${currentMode} → ${newDarkMode}`);
        set({ darkMode: newDarkMode });
        // Appliquer immédiatement sur le HTML avec styles inline
        const htmlElement = document.documentElement;
        if (newDarkMode) {
          htmlElement.classList.add('dark');
          htmlElement.style.colorScheme = 'dark';
          document.body.style.backgroundColor = '#0F0F0F';
          document.body.style.color = '#FFFFFF';
          console.log('🌙 Dark mode activé avec styles inline');
        } else {
          htmlElement.classList.remove('dark');
          htmlElement.style.colorScheme = 'light';
          document.body.style.backgroundColor = '#F5F5F5';
          document.body.style.color = '#1F1F1F';
          console.log('☀️ Light mode activé avec styles inline');
        }
      },
      
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Modals
      activeModal: null,
      modalData: null,
      openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),
      
      // Toasts
      toasts: [],
      addToast: (type, message) => {
        const id = `toast_${Date.now()}`;
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }]
        }));
        // Auto remove after 4 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }));
      },
      
      // Loading
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Page title
      pageTitle: 'Tableau de bord',
      setPageTitle: (title) => set({ pageTitle: title })
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ darkMode: state.darkMode })
    }
  )
);


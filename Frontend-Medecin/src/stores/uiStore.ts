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
  darkMode: boolean;
  toggleDarkMode: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeModal: ModalType;
  modalData: any;
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        set({ darkMode: newDarkMode });
        const htmlElement = document.documentElement;
        if (newDarkMode) {
          htmlElement.classList.add('dark');
          htmlElement.style.colorScheme = 'dark';
          document.body.style.backgroundColor = '#0F0F0F';
          document.body.style.color = '#FFFFFF';
        } else {
          htmlElement.classList.remove('dark');
          htmlElement.style.colorScheme = 'light';
          document.body.style.backgroundColor = '#F5F5F5';
          document.body.style.color = '#1F1F1F';
        }
      },
      sidebarCollapsed: false,
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      activeModal: null,
      modalData: null,
      openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),
      toasts: [],
      addToast: (type, message) => {
        const id = `toast_${Date.now()}`;
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }]
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }));
      },
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      pageTitle: 'Tableau de bord',
      setPageTitle: (title) => set({ pageTitle: title })
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ darkMode: state.darkMode })
    }
  )
);


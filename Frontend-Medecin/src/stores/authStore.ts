import { create } from 'zustand';
import { mockDoctors, type Doctor } from '../utils/mockData';

interface AuthState {
  doctor: Doctor | null;
  isAuthenticated: boolean;
  login: (doctorId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Par défaut, on simule un médecin connecté
  doctor: mockDoctors[0],
  isAuthenticated: true,
  
  login: (doctorId: string) => {
    const doctor = mockDoctors.find(d => d.doctorId === doctorId);
    if (doctor) {
      set({ doctor, isAuthenticated: true });
    }
  },
  
  logout: () => {
    set({ doctor: null, isAuthenticated: false });
  }
}));


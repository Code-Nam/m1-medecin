import { create } from 'zustand';
import { authService } from '../services/authService';

export interface User {
  id: string;
  email: string;
  firstName: string;
  surname: string;
  role: 'DOCTOR' | 'SECRETARY';
  doctorId?: string;
  secretaryId?: string;
  title?: string;
  specialization?: string;
  doctors?: Array<{
    id: string;
    doctorId: string;
    firstName: string;
    surname: string;
    title?: string;
    specialization: string;
  }>;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  selectedDoctorId: string | null;

  login: (user: User) => void;
  logout: () => void;
  setSelectedDoctor: (doctorId: string | null) => void;
  initialize: () => void;

  getDoctor: () => {
    id: string;
    doctorId: string;
    firstName: string;
    surname: string;
    title?: string;
    specialization?: string;
  } | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  selectedDoctorId: null,

  login: (user: User) => {
    set({ user, isAuthenticated: true });
    if (user.role === 'SECRETARY' && user.doctors && user.doctors.length > 0) {
      set({ selectedDoctorId: user.doctors[0]?.id });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, selectedDoctorId: null });
  },

  setSelectedDoctor: (doctorId: string | null) => {
    set({ selectedDoctorId: doctorId });
  },

  initialize: () => {
    const token = authService.getStoredToken();
    const user = authService.getStoredUser();
    if (token && user) {
      set({ user, isAuthenticated: true, isInitialized: true });
      if (user.role === 'SECRETARY' && user.doctors && user.doctors.length > 0) {
        set({ selectedDoctorId: user.doctors[0]?.id });
      }
    } else {
      set({ isInitialized: true });
    }
  },

  getDoctor: () => {
    const { user, selectedDoctorId } = get();

    if (!user) return null;

    if (user.role === 'DOCTOR' && user.doctorId) {
      return {
        id: user.id,
        doctorId: user.doctorId,
        firstName: user.firstName,
        surname: user.surname,
        title: user.title,
        specialization: user.specialization,
      };
    }

    if (user.role === 'SECRETARY' && user.doctors && selectedDoctorId) {
      const selectedDoctor = user.doctors.find(d => d.id === selectedDoctorId);
      if (selectedDoctor) {
        return {
          id: selectedDoctor.id,
          doctorId: selectedDoctor.doctorId,
          firstName: selectedDoctor.firstName,
          surname: selectedDoctor.surname,
          title: selectedDoctor.title,
          specialization: selectedDoctor.specialization,
        };
      }
    }

    if (user.role === 'SECRETARY' && user.doctors && user.doctors.length > 0) {
      const firstDoctor = user.doctors[0];
      if (!firstDoctor) return null;
      return {
        id: firstDoctor.id,
        doctorId: firstDoctor.doctorId,
        firstName: firstDoctor.firstName,
        surname: firstDoctor.surname,
        title: firstDoctor.title,
        specialization: firstDoctor.specialization,
      };
    }

    return null;
  },
}));

export const useDoctor = () => {
  const user = useAuthStore((state) => state.user);
  const selectedDoctorId = useAuthStore((state) => state.selectedDoctorId);

  if (!user) return null;

  if (user.role === 'DOCTOR') {
    return {
      id: user.id,
      firstName: user.firstName,
      surname: user.surname,
      title: user.title,
      specialization: user.specialization,
    };
  }

  if (user.role === 'SECRETARY' && user.doctors && selectedDoctorId) {
    const selectedDoctor = user.doctors.find(d => d.id === selectedDoctorId);
    if (selectedDoctor) {
      return {
        id: selectedDoctor.id,
        firstName: selectedDoctor.firstName,
        surname: selectedDoctor.surname,
        title: selectedDoctor.title,
        specialization: selectedDoctor.specialization,
      };
    }
  }

  if (user.role === 'SECRETARY' && user.doctors && user.doctors.length > 0) {
    const firstDoctor = user.doctors[0];
    if (!firstDoctor) return null;
    return {
      id: firstDoctor.id,
      firstName: firstDoctor.firstName,
      surname: firstDoctor.surname,
      title: firstDoctor.title,
      specialization: firstDoctor.specialization,
    };
  }

  return null;
};

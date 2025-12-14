import { create } from 'zustand';
import { Doctor } from '../types';
import { doctorService } from '../services';

interface DoctorStore {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  isLoading: boolean;
  error: string | null;

  fetchAllDoctors: () => Promise<void>;
  fetchDoctorById: (id: string) => Promise<void>;
  selectDoctor: (doctor: Doctor | null) => void;
}

export const useDoctorStore = create<DoctorStore>((set) => ({
  doctors: [],
  selectedDoctor: null,
  isLoading: false,
  error: null,

  fetchAllDoctors: async () => {
    set({ isLoading: true });
    try {
      const doctors = await doctorService.getAllDoctors();
      set({ doctors });
    } catch (error: any) {
      set({ error: error.message || 'Erreur chargement docteurs' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDoctorById: async (id) => {
    set({ isLoading: true });
    try {
      const doctor = await doctorService.getDoctor(id);
      set({ selectedDoctor: doctor });
    } catch (error: any) {
      set({ error: error.message || 'Erreur chargement docteur details' });
    } finally {
      set({ isLoading: false });
    }
  },

  selectDoctor: (doctor) => set({ selectedDoctor: doctor }),
}));

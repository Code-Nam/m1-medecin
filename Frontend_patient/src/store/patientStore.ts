import { create } from 'zustand';
import { Patient, PatientUpdatePayload } from '../types';
import { patientService } from '../services';

interface PatientStore {
  currentPatient: Patient | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPatient: (patientId: string) => Promise<void>;
  updatePatient: (patientId: string, data: PatientUpdatePayload) => Promise<void>;
  logout: () => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  currentPatient: null,
  isLoading: false,
  error: null,

  fetchPatient: async (patientId) => {
    set({ isLoading: true });
    try {
      const patient = await patientService.getPatient(patientId);
      set({ currentPatient: patient });
    } catch (error: any) {
      set({ error: error.message || 'Erreur chargement profil patient' });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePatient: async (patientId, data) => {
    set({ isLoading: true });
    try {
      const updatedPatient = await patientService.updatePatient(patientId, data);
      set({ currentPatient: updatedPatient });
    } catch (error: any) {
      set({ error: error.message || 'Erreur mise à jour profil' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => set({ currentPatient: null }),
}));

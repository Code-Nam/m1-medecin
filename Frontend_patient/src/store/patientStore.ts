import { create } from 'zustand';
import type { Patient, PatientUpdatePayload } from '../types';
import { patientService } from '../services';
import { authService } from '../services/authService';

interface PatientStore {
  currentPatient: Patient | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isAuthenticated: boolean;

  fetchPatient: (patientId: string) => Promise<void>;
  updatePatient: (patientId: string, data: PatientUpdatePayload) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  currentPatient: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  isAuthenticated: false,

  fetchPatient: async (patientId) => {
    set({ isLoading: true });
    try {
      const patient = await patientService.getPatient(patientId);
      set({ currentPatient: patient, isAuthenticated: true });
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

  logout: () => {
    authService.logout();
    set({ currentPatient: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = authService.getStoredToken();
    const user = authService.getStoredUser();

    // Vérification stricte du rôle : on ne garde la session que si c'est un patient
    if (token && user && user.role === 'PATIENT') {
      set({ isAuthenticated: true, isInitialized: true });
    } else {
      // Si c'est un token invalide ou un autre rôle (ex: DOCTEUR), on nettoie
      authService.logout();
      set({ isAuthenticated: false, currentPatient: null, isInitialized: true });
    }
  },
}));

import ApiClient from './api.client';
import type { Patient, PatientUpdatePayload } from '../types';

export const patientService = {
  getPatient: async (patientId: string): Promise<Patient> => {
    const response = await ApiClient.get<any>(`/patients/${patientId}`);
    return {
      ...response,
      patientId: response.id || response.patientId
    };
  },

  updatePatient: async (patientId: string, data: PatientUpdatePayload): Promise<Patient> => {
    const response = await ApiClient.put<any>(`/patients/${patientId}`, data);
    return {
      ...response,
      patientId: response.id || response.patientId
    };
  },
};

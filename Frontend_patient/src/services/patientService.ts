import { ApiClient } from './api.client';
import { Patient, PatientUpdatePayload } from '../types';

export const patientService = {
  getPatient: async (patientId: string): Promise<Patient> => {
    return ApiClient.get<Patient>(`/patients/${patientId}`);
  },

  updatePatient: async (patientId: string, data: PatientUpdatePayload): Promise<Patient> => {
    return ApiClient.put<Patient>(`/patients/${patientId}`, data);
  },
};

import { ApiClient } from './api.client';
import { Doctor } from '../types';

export const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    return ApiClient.get<Doctor[]>('/doctors');
  },

  getDoctor: async (doctorId: string): Promise<Doctor> => {
    return ApiClient.get<Doctor>(`/doctors/${doctorId}`);
  },
};

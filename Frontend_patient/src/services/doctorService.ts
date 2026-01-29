import ApiClient from './api.client';
import type { Doctor } from '../types';

export const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    const response = await ApiClient.get<{ doctors: Doctor[] } | Doctor[]>('/doctors/all');
    if ('doctors' in response && Array.isArray(response.doctors)) {
      return response.doctors;
    }
    return response as Doctor[];
  },

  getDoctor: async (doctorId: string): Promise<Doctor> => {
    return ApiClient.get<Doctor>(`/doctors/${doctorId}`);
  },

  getAvailableSlots: async (doctorId: string, date: string): Promise<any> => {
    return ApiClient.get(`/availability/${doctorId}/slots?date=${date}`);
  },
};

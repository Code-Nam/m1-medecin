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

  getAvailableSlots: async (doctorId: string, date: string): Promise<any[]> => {
    const response = await ApiClient.get<{ slots: any[] } | any[]>(`/availability/${doctorId}/slots?date=${date}`);
    if ('slots' in response && Array.isArray(response.slots)) {
      return response.slots;
    }
    return Array.isArray(response) ? response : [];
  },
};

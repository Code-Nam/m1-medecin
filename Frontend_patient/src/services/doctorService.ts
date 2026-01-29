import ApiClient from './api.client';
import { Doctor } from '../types';

export const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    const response = await ApiClient.get<{ doctors: Doctor[] }>('/doctors/all');
    return response.doctors || [];
  },

  getDoctor: async (doctorId: string): Promise<Doctor> => {
    return ApiClient.get<Doctor>(`/doctors/${doctorId}`);
  },

  getAvailableSlots: async (doctorId: string, date: string): Promise<any> => {
    return ApiClient.get(`/availability/${doctorId}/slots?date=${date}`);
  },
};

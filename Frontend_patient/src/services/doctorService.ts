import ApiClient from './api.client';
import type { Doctor } from '../types';

export const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    const response = await ApiClient.get<{ doctors: any[] } | any[]>('/doctors/all');
    let doctors: any[] = [];
    if ('doctors' in response && Array.isArray(response.doctors)) {
      doctors = response.doctors;
    } else if (Array.isArray(response)) {
      doctors = response;
    }
    
    return doctors.map((doc) => ({
      ...doc,
      doctorId: doc.id || doc.doctorId,
    }));
  },

  getDoctor: async (doctorId: string): Promise<Doctor> => {
    const doc: any = await ApiClient.get(`/doctors/${doctorId}`);
    return {
        ...doc,
        doctorId: doc.id || doc.doctorId
    };
  },

  getAvailableSlots: async (doctorId: string, date: string): Promise<any[]> => {
    const response = await ApiClient.get<{ slots: any[] } | any[]>(`/availability/${doctorId}/slots?date=${date}`);
    if ('slots' in response && Array.isArray(response.slots)) {
      return response.slots;
    }
    return Array.isArray(response) ? response : [];
  },
};

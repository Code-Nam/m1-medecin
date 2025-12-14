import { ApiClient } from './api.client';
import { Appointment } from '../types';

export const appointmentService = {
  getAppointments: async (patientId: string): Promise<{ appointments: Appointment[] }> => {
    return ApiClient.get<{ appointments: Appointment[] }>(`/appointments/${patientId}`);
  },

  createAppointment: async (appointment: Omit<Appointment, 'appointmentId' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
    return ApiClient.post<Appointment>('/appointments', appointment);
  },

  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    return ApiClient.put<Appointment>(`/appointments/${id}`, data);
  },

  deleteAppointment: async (id: string): Promise<void> => {
    return ApiClient.delete<void>(`/appointments/${id}`);
  },
};

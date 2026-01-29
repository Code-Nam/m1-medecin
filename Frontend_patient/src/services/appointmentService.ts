import ApiClient from './api.client';
import type { Appointment } from '../types';

export const appointmentService = {
  getAppointments: async (patientId: string): Promise<{ appointments: Appointment[] }> => {
    const response = await ApiClient.get<{ data: Appointment[]; pagination: any }>(`/appointments?patientId=${patientId}`);
    return { appointments: response.data };
  },

  createAppointment: async (appointment: {
    appointedPatientId: string;
    appointedDoctorId: string;
    date: string;
    time: string;
    reason: string;
    notes?: string;
  }): Promise<Appointment> => {
    return ApiClient.post<Appointment>('/appointments', appointment);
  },

  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    return ApiClient.put<Appointment>(`/appointments/${id}`, data);
  },

  deleteAppointment: async (id: string): Promise<void> => {
    return ApiClient.delete<void>(`/appointments/${id}`);
  },
};

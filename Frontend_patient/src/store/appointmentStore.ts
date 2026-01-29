import { create } from 'zustand';
import { Appointment, AppointmentStatus } from '../types';
import { appointmentService } from '../services';

interface AppointmentStore {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;

  fetchAppointments: (patientId: string) => Promise<void>;
  createAppointment: (appointment: Omit<Appointment, 'appointmentId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  setError: (error: string | null) => void;

  getAppointmentsByStatus: (status: AppointmentStatus) => Appointment[];
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  fetchAppointments: async (patientId) => {
    set({ isLoading: true });
    try {
      const { appointments } = await appointmentService.getAppointments(patientId);
      set({ appointments: appointments || [] });
    } catch (error: any) {
      set({ error: error.message || 'Erreur lors du chargement des rendez-vous' });
    } finally {
      set({ isLoading: false });
    }
  },

  createAppointment: async (appointment) => {
    set({ isLoading: true });
    try {
      const newAppt = await appointmentService.createAppointment(appointment);
      set({ appointments: [...get().appointments, newAppt] });
    } catch (error: any) {
      set({ error: error.message || 'Impossible de créer le rendez-vous' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAppointment: async (id, data) => {
    set({ isLoading: true });
    try {
      const updatedAppt = await appointmentService.updateAppointment(id, data);
      set({
        appointments: get().appointments.map((appt) =>
          appt.appointmentId === id ? updatedAppt : appt
        ),
      });
    } catch (error: any) {
      set({ error: error.message || 'Impossible de mettre à jour le rendez-vous' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAppointment: async (id) => {
    set({ isLoading: true });
    try {
      await appointmentService.deleteAppointment(id);
      set({
        appointments: get().appointments.filter((appt) => appt.appointmentId !== id),
      });
    } catch (error: any) {
      set({ error: error.message || 'Impossible de supprimer le rendez-vous' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelAppointment: async (id) => {
    set({ isLoading: true });
    try {
      await appointmentService.updateAppointment(id, { status: 'CANCELLED' as any });
      set({
        appointments: get().appointments.map((appt) =>
          appt.appointmentId === id ? { ...appt, status: 'CANCELLED' as any } : appt
        ),
      });
    } catch (error: any) {
      set({ error: error.message || 'Impossible d\'annuler le rendez-vous' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setError: (error) => set({ error }),

  getAppointmentsByStatus: (status) => {
    return get().appointments.filter((appt) => appt.status === status);
  },

  getUpcomingAppointments: () => {
    const now = new Date();
    return get().appointments
      .filter((appt) => new Date(`${appt.date}T${appt.time}`) >= now)
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  },

  getPastAppointments: () => {
    const now = new Date();
    return get().appointments
      .filter((appt) => new Date(`${appt.date}T${appt.time}`) < now)
      .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
  },
}));

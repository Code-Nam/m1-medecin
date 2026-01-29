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
      .filter((appt) => {
        const [day, month, year] = appt.date.split('-').map(Number);
        const apptDate = new Date(year, month - 1, day);
        const [hours, minutes] = appt.time.split(':').map(Number);
        apptDate.setHours(hours, minutes);
        return apptDate >= now;
      })
      .sort((a, b) => {
        const [d1, m1, y1] = a.date.split('-').map(Number);
        const dateA = new Date(y1, m1 - 1, d1);
        const [h1, min1] = a.time.split(':').map(Number);
        dateA.setHours(h1, min1);

        const [d2, m2, y2] = b.date.split('-').map(Number);
        const dateB = new Date(y2, m2 - 1, d2);
        const [h2, min2] = b.time.split(':').map(Number);
        dateB.setHours(h2, min2);
        
        return dateA.getTime() - dateB.getTime();
      });
  },

  getPastAppointments: () => {
    const now = new Date();
    return get().appointments
      .filter((appt) => {
        const [day, month, year] = appt.date.split('-').map(Number);
        const apptDate = new Date(year, month - 1, day);
        const [hours, minutes] = appt.time.split(':').map(Number);
        apptDate.setHours(hours, minutes);
        return apptDate < now;
      })
      .sort((a, b) => {
        const [d1, m1, y1] = a.date.split('-').map(Number);
        const dateA = new Date(y1, m1 - 1, d1);
        const [h1, min1] = a.time.split(':').map(Number);
        dateA.setHours(h1, min1);

        const [d2, m2, y2] = b.date.split('-').map(Number);
        const dateB = new Date(y2, m2 - 1, d2);
        const [h2, min2] = b.time.split(':').map(Number);
        dateB.setHours(h2, min2);
        
        return dateB.getTime() - dateA.getTime();
      });
  },
}));

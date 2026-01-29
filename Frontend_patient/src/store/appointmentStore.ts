import { create } from 'zustand';
import { type Appointment, AppointmentStatus } from '../types';
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
        if (!appt.date) return false;
        if (appt.date.includes('-')) {
            const parts = appt.date.split('-');
            if (parts.length === 3) {
                const day = Number(parts[0]);
                const month = Number(parts[1]);
                const year = Number(parts[2]);
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                    const apptDate = new Date(year, month - 1, day);
                    const timeParts = appt.time ? appt.time.split(':') : ['0', '0'];
                    const hours = Number(timeParts[0]);
                    const minutes = Number(timeParts[1]);
                    if (!isNaN(hours) && !isNaN(minutes)) {
                         apptDate.setHours(hours, minutes);
                         return apptDate >= now;
                    }
                }
            }
        }
        // Fallback
        const apptDate = new Date(appt.date);
        return !isNaN(apptDate.getTime()) && apptDate >= now;
      })
      .sort((a, b) => {
        // Helper to get timestamp
        const getTimestamp = (appt: Appointment) => {
             if (appt.date && appt.date.includes('-')) {
                 const parts = appt.date.split('-');
                 if (parts.length >= 3) {
                     const d = Number(parts[0]);
                     const m = Number(parts[1]);
                     const y = Number(parts[2]);
                     if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                         const date = new Date(y, m - 1, d);
                         if (appt.time) {
                             const timeParts = appt.time.split(':');
                             if (timeParts.length >= 2) {
                                 const h = Number(timeParts[0]);
                                 const min = Number(timeParts[1]);
                                 if (!isNaN(h) && !isNaN(min)) {
                                     date.setHours(h, min);
                                 }
                             }
                         }
                         return date.getTime();
                     }
                 }
             }
             return new Date(appt.date).getTime();
        };
        return getTimestamp(a) - getTimestamp(b);
      });
  },

  getPastAppointments: () => {
    const now = new Date();
    return get().appointments
      .filter((appt) => {
         if (!appt.date) return false;
         if (appt.date.includes('-')) {
            const parts = appt.date.split('-');
            if (parts.length === 3) {
                const day = Number(parts[0]);
                const month = Number(parts[1]);
                const year = Number(parts[2]);
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                    const apptDate = new Date(year, month - 1, day);
                    const timeParts = appt.time ? appt.time.split(':') : ['0', '0'];
                    const hours = Number(timeParts[0]);
                    const minutes = Number(timeParts[1]);
                    if (!isNaN(hours) && !isNaN(minutes)) {
                         apptDate.setHours(hours, minutes);
                         return apptDate < now;
                    }
                }
            }
         }
         // Fallback
         const apptDate = new Date(appt.date);
         return !isNaN(apptDate.getTime()) && apptDate < now;
      })
      .sort((a, b) => {
        // Helper to get timestamp
        const getTimestamp = (appt: Appointment) => {
             if (appt.date && appt.date.includes('-')) {
                 const parts = appt.date.split('-');
                 if (parts.length >= 3) {
                     const d = Number(parts[0]);
                     const m = Number(parts[1]);
                     const y = Number(parts[2]);
                     if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                         const date = new Date(y, m - 1, d);
                         if (appt.time) {
                             const timeParts = appt.time.split(':');
                             if (timeParts.length >= 2) {
                                 const h = Number(timeParts[0]);
                                 const min = Number(timeParts[1]);
                                 if (!isNaN(h) && !isNaN(min)) {
                                     date.setHours(h, min);
                                 }
                             }
                         }
                         return date.getTime();
                     }
                 }
             }
             return new Date(appt.date).getTime();
        };
        return getTimestamp(b) - getTimestamp(a);
      });
  },
}));

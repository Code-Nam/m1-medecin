import { create } from 'zustand';
import { appointmentsService } from '../services/api';
import type { Appointment } from '../types';
import { formatDateAPI } from '../utils/dateFormatter';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  selectedDate: Date;

  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Omit<Appointment, 'appointmentId'>) => Promise<void>;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (appointmentId: string) => Promise<void>;
  selectAppointment: (appointment: Appointment | null) => void;
  setSelectedDate: (date: Date) => void;
  confirmAppointment: (appointmentId: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;

  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentsByDate: (date: Date) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getTodayAppointments: (doctorId: string) => Appointment[];
  getPendingAppointments: (doctorId: string) => Appointment[];
  getAppointmentsForCalendar: (doctorId: string) => any[];
  fetchAppointments: (doctorId: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  selectedAppointment: null,
  selectedDate: new Date(),

  setAppointments: (appointments) => set({ appointments }),

  fetchAppointments: async (doctorId) => {
    try {
      const response: any = await appointmentsService.getByDoctor(doctorId, 1, 100);
      const appointments = response.data || response.appointments || response;

      const mappedAppointments = Array.isArray(appointments) ? appointments.map((a: any) => ({
        appointmentId: a.id || a.appointmentId,
        appointedPatient: a.appointedPatient?.id || a.appointedPatient,
        appointedDoctor: a.appointedDoctor?.id || a.appointedDoctor,
        date: a.date,
        time: a.time,
        reason: a.reason,
        status: (a.status || 'PENDING').toUpperCase() as Appointment['status'],
        createdBy: a.createdBy || 'doctor',
        patientName: a.patient ? `${a.patient.firstName} ${a.patient.surname}` : undefined
      })) : [];

      set({ appointments: mappedAppointments });
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  },

  addAppointment: async (appointmentData) => {
    try {
      const response: any = await appointmentsService.create(appointmentData as any);
      const appt = response.appointment || response;
      const newAppointment: Appointment = {
        appointmentId: appt.id || appt.appointmentId || `appt_${Date.now()}`,
        appointedPatient: appt.appointedPatient?.id || appt.appointedPatient || appointmentData.appointedPatient,
        appointedDoctor: appt.appointedDoctor?.id || appt.appointedDoctor || appointmentData.appointedDoctor,
        date: appt.date || appointmentData.date,
        time: appt.time || appointmentData.time,
        reason: appt.reason || appointmentData.reason,
        status: ((appt.status || 'PENDING') as string).toUpperCase() as Appointment['status'],
        createdBy: (appointmentData as any).createdBy || 'doctor',
      };
      set((state) => ({
        appointments: [...state.appointments, newAppointment]
      }));
    } catch (error) {
      throw error;
    }
  },

  updateAppointment: async (appointmentId, updates) => {
    try {
      const response: any = await appointmentsService.update(appointmentId, updates as any);
      const appt = response.appointment || response;
      const transformedAppointment: Appointment = {
        appointmentId: appt.id || appt.appointmentId || appointmentId,
        appointedPatient: appt.appointedPatient?.id || appt.appointedPatient || updates.appointedPatient || '',
        appointedDoctor: appt.appointedDoctor?.id || appt.appointedDoctor || updates.appointedDoctor || '',
        date: appt.date || updates.date || '',
        time: appt.time || updates.time || '',
        reason: appt.reason || updates.reason || '',
        status: ((appt.status || updates.status || 'PENDING') as string).toUpperCase() as Appointment['status'],
        createdBy: (updates as any).createdBy || 'doctor',
      };
      set((state) => ({
        appointments: state.appointments.map(a =>
          a.appointmentId === appointmentId ? transformedAppointment : a
        )
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteAppointment: async (appointmentId) => {
    try {
      await appointmentsService.delete(appointmentId);
      set((state) => ({
        appointments: state.appointments.filter(a => a.appointmentId !== appointmentId)
      }));
    } catch (error) {
      console.error('Failed to delete appointment', error);
      throw error;
    }
  },

  selectAppointment: (appointment) => set({ selectedAppointment: appointment }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  confirmAppointment: async (appointmentId) => {
    try {
      await appointmentsService.update(appointmentId, { status: 'CONFIRMED' });
      set((state) => ({
        appointments: state.appointments.map(a =>
          a.appointmentId === appointmentId
            ? { ...a, status: 'CONFIRMED' }
            : a
        )
      }));
    } catch (error) {
      console.error('Failed to confirm appointment', error);
      throw error;
    }
  },

  cancelAppointment: async (appointmentId) => {
    try {
      await appointmentsService.update(appointmentId, { status: 'CANCELLED' });
      set((state) => ({
        appointments: state.appointments.map(a =>
          a.appointmentId === appointmentId
            ? { ...a, status: 'CANCELLED' }
            : a
        )
      }));
    } catch (error) {
      console.error('Failed to cancel appointment', error);
      throw error;
    }
  },

  getAppointmentsByDoctor: (doctorId) => {
    const { appointments } = get();
    return appointments.filter(a => a.appointedDoctor === doctorId);
  },

  getAppointmentsByDate: (date) => {
    const { appointments } = get();
    const dateStr = formatDateAPI(date);
    return appointments.filter(a => a.date === dateStr);
  },

  getAppointmentsByPatient: (patientId) => {
    const { appointments } = get();
    return appointments.filter(a => a.appointedPatient === patientId);
  },

  getTodayAppointments: (doctorId) => {
    const { appointments } = get();
    const today = formatDateAPI(new Date());
    return appointments
      .filter(a => a.appointedDoctor === doctorId && a.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  },

  getPendingAppointments: (doctorId) => {
    const { appointments } = get();
    return appointments.filter(
      a => a.appointedDoctor === doctorId && a.status === 'PENDING'
    );
  },

  getAppointmentsForCalendar: (doctorId) => {
    const { appointments } = get();
    return appointments
      .filter(a => a.appointedDoctor === doctorId)
      .map(a => {
        const dateParts = a.date.split('-');
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        let backgroundColor = '#22c55e'; // vert - confirmé
        let borderColor = '#16a34a';

        if (a.status === 'PENDING') {
          backgroundColor = '#eab308'; // jaune
          borderColor = '#ca8a04';
        } else if (a.status === 'CANCELLED') {
          backgroundColor = '#6b7280'; // gris
          borderColor = '#4b5563';
        } else if (a.status === 'DOCTOR_CREATED') {
          backgroundColor = '#3b82f6'; // bleu
          borderColor = '#2563eb';
        }

        return {
          id: a.appointmentId,
          title: a.reason,
          start: `${isoDate}T${a.time}:00`,
          end: `${isoDate}T${addMinutes(a.time, 30)}:00`,
          backgroundColor,
          borderColor,
          extendedProps: {
            ...a
          }
        };
      });
  }
}));

function addMinutes(time: string, minutes: number): string {
  const [hStr, mStr] = time.split(':');
  if (!hStr || !mStr) return time;

  const h = Number(hStr);
  const m = Number(mStr);

  if (isNaN(h) || isNaN(m)) return time;

  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

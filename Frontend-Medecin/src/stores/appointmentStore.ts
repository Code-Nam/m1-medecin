import { create } from 'zustand';
import { appointmentsService } from '../services/api';
import type { Appointment } from '../types';
import { formatDateAPI, parseDateAPI } from '../utils/dateFormatter';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  selectedDate: Date;

  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Omit<Appointment, 'appointmentId'>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
  selectAppointment: (appointment: Appointment | null) => void;
  setSelectedDate: (date: Date) => void;
  confirmAppointment: (appointmentId: string) => void;
  cancelAppointment: (appointmentId: string) => void;

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
      // Ensure we map the response correctly depending on API format
      const appointments = response.appointments || response;

      const mappedAppointments = Array.isArray(appointments) ? appointments.map((a: any) => ({
        appointmentId: a.id || a.appointmentId,
        appointedPatient: a.appointedPatient?.id || a.appointedPatient,
        appointedDoctor: a.appointedDoctor?.id || a.appointedDoctor,
        date: a.date,
        time: a.time,
        reason: a.reason,
        status: a.status,
        createdBy: a.createdBy || 'doctor'
      })) : [];

      set({ appointments: mappedAppointments });
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  },

  addAppointment: async (appointmentData) => {
    try {
      const apiPayload = {
        ...appointmentData,
        appointedPatientId: appointmentData.appointedPatient,
        appointedDoctorId: appointmentData.appointedDoctor,
      };
      // remove non-API fields if necessary, or just spread. The service defines specific fields.
      const response: any = await appointmentsService.create(apiPayload as any);
      const newAppointment: Appointment = {
        appointmentId: response.id || response.appointmentId || `appt_${Date.now()}`,
        appointedPatient: response.appointedPatient || appointmentData.appointedPatient,
        appointedDoctor: response.appointedDoctor || appointmentData.appointedDoctor,
        date: response.date || appointmentData.date,
        time: response.time || appointmentData.time,
        reason: response.reason || appointmentData.reason,
        status: (response.status || (appointmentData as any).status || 'pending') as Appointment['status'],
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
      const apiUpdates: any = { ...updates };
      if (updates.appointedPatient) apiUpdates.appointedPatientId = updates.appointedPatient;
      if (updates.appointedDoctor) apiUpdates.appointedDoctorId = updates.appointedDoctor;

      const updatedAppointment: any = await appointmentsService.update(appointmentId, apiUpdates);
      const transformedAppointment: Appointment = {
        appointmentId: updatedAppointment.id || updatedAppointment.appointmentId || appointmentId,
        appointedPatient: updatedAppointment.appointedPatient || updates.appointedPatient || '',
        appointedDoctor: updatedAppointment.appointedDoctor || updates.appointedDoctor || '',
        date: updatedAppointment.date || updates.date || '',
        time: updatedAppointment.time || updates.time || '',
        reason: updatedAppointment.reason || updates.reason || '',
        status: (updatedAppointment.status || updates.status || 'pending') as Appointment['status'],
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

  deleteAppointment: (appointmentId) => {
    set((state) => ({
      appointments: state.appointments.filter(a => a.appointmentId !== appointmentId)
    }));
  },

  selectAppointment: (appointment) => set({ selectedAppointment: appointment }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  confirmAppointment: (appointmentId) => {
    set((state) => ({
      appointments: state.appointments.map(a =>
        a.appointmentId === appointmentId
          ? { ...a, status: 'confirmed' as const }
          : a
      )
    }));
  },

  cancelAppointment: (appointmentId) => {
    set((state) => ({
      appointments: state.appointments.map(a =>
        a.appointmentId === appointmentId
          ? { ...a, status: 'cancelled' as const }
          : a
      )
    }));
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
      a => a.appointedDoctor === doctorId && a.status === 'pending'
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

        if (a.status === 'pending') {
          backgroundColor = '#eab308'; // jaune
          borderColor = '#ca8a04';
        } else if (a.status === 'cancelled') {
          backgroundColor = '#6b7280'; // gris
          borderColor = '#4b5563';
        } else if (a.status === 'doctor_created') {
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
  if (!hStr || !mStr) return time; // Return original time if format is invalid

  const h = Number(hStr);
  const m = Number(mStr);

  if (isNaN(h) || isNaN(m)) return time; // Return original time if parsing fails

  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

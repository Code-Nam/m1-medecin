import { create } from 'zustand';
import { mockAppointments, type Appointment } from '../utils/mockData';
import { formatDateAPI, parseDateAPI } from '../utils/dateFormatter';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  selectedDate: Date;
  
  // Actions
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Omit<Appointment, 'appointmentId'>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (appointmentId: string) => void;
  selectAppointment: (appointment: Appointment | null) => void;
  setSelectedDate: (date: Date) => void;
  confirmAppointment: (appointmentId: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  
  // Getters
  getAppointmentsByDoctor: (doctorId: string) => Appointment[];
  getAppointmentsByDate: (date: Date) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getTodayAppointments: (doctorId: string) => Appointment[];
  getPendingAppointments: (doctorId: string) => Appointment[];
  getAppointmentsForCalendar: (doctorId: string) => any[];
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: mockAppointments,
  selectedAppointment: null,
  selectedDate: new Date(),
  
  setAppointments: (appointments) => set({ appointments }),
  
  addAppointment: (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      appointmentId: `appt_${Date.now()}`
    };
    set((state) => ({
      appointments: [...state.appointments, newAppointment]
    }));
  },
  
  updateAppointment: (appointmentId, updates) => {
    set((state) => ({
      appointments: state.appointments.map(a =>
        a.appointmentId === appointmentId ? { ...a, ...updates } : a
      )
    }));
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
        // Convertir date de dd-MM-yyyy à yyyy-MM-dd
        const dateParts = a.date.split('-');
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        
        // Couleur selon statut
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

// Helper pour ajouter des minutes à une heure
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + minutes;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}


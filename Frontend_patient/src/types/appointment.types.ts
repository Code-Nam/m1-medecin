export enum AppointmentStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  DOCTOR_CREATED = 'DOCTOR_CREATED',
  COMPLETED = 'COMPLETED',
}

export interface Appointment {
  appointmentId: string;
  appointedPatient: string; // Patient ID
  appointedDoctor: string; // Doctor ID
  date: string; // dd-MM-yyyy
  time: string; // HH:mm AM/PM
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  slotId?: string;
}

export interface AppointmentSlot {
  time: string;
  available: boolean;
  doctorId: string;
  slotId?: string; // ID du créneau pour la réservation
}

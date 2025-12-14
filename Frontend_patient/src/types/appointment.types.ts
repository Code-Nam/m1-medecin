export enum AppointmentStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  DOCTOR_CREATED = 'doctor_created',
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
}

export interface AppointmentSlot {
  time: string;
  available: boolean;
  doctorId: string;
  slotId?: string; // ID du créneau pour la réservation
}

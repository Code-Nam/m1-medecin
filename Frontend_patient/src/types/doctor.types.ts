import { AppointmentSlot } from './appointment.types';

export interface Doctor {
  doctorId: string;
  firstName: string;
  surname: string;
  specialization: string;
  email: string;
  phone: string;
  availableSlots?: AppointmentSlot[];
}

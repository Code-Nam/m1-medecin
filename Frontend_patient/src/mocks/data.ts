import type { Appointment, Doctor, Patient } from '../types';
import { AppointmentStatus } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    patientId: '1',
    firstName: 'Raphaël',
    surname: 'Martin',
    email: 'raphael.martin@example.com',
    phone: '06 12 34 56 78',
    dateOfBirth: '1990-05-15',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    doctorId: 'd1',
    firstName: 'Sophie',
    surname: 'Bernard',
    specialization: 'Généraliste',
    email: 'sophie.bernard@medecin.fr',
    phone: '01 45 67 89 10',
    availableSlots: [
      { time: '09:00', available: true, doctorId: 'd1' },
      { time: '10:00', available: true, doctorId: 'd1' },
      { time: '14:00', available: true, doctorId: 'd1' },
      { time: '15:30', available: true, doctorId: 'd1' },
    ],
  },
  {
    doctorId: 'd2',
    firstName: 'Thomas',
    surname: 'Dubois',
    specialization: 'Dentiste',
    email: 'thomas.dubois@medecin.fr',
    phone: '01 98 76 54 32',
    availableSlots: [
      { time: '11:00', available: true, doctorId: 'd2' },
      { time: '13:00', available: true, doctorId: 'd2' },
      { time: '16:00', available: true, doctorId: 'd2' },
    ],
  },
    {
    doctorId: 'd3',
    firstName: 'Marie',
    surname: 'Leroy',
    specialization: 'Dermatologue',
    email: 'marie.leroy@medecin.fr',
    phone: '01 22 33 44 55',
    availableSlots: [
      { time: '09:30', available: true, doctorId: 'd3' },
      { time: '10:30', available: true, doctorId: 'd3' },
      { time: '15:00', available: true, doctorId: 'd3' },
    ],
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    appointmentId: 'a1',
    appointedPatient: '1',
    appointedDoctor: 'd1',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().substring(0, 10), // In 2 days
    time: '10:00',
    reason: 'Consultation annuelle',
    status: AppointmentStatus.CONFIRMED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    appointmentId: 'a2',
    appointedPatient: '1',
    appointedDoctor: 'd2',
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().substring(0, 10), // 10 days ago
    time: '14:00',
    reason: 'Détartrage',
    status: AppointmentStatus.CONFIRMED,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
   {
    appointmentId: 'a3',
    appointedPatient: '1',
    appointedDoctor: 'd3',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().substring(0, 10), // In 5 days
    time: '09:30',
    reason: 'Vérification grain de beauté',
    status: AppointmentStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

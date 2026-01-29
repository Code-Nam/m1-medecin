import { z } from 'zod';

export const patientCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  assigned_doctor: z.string().optional(),
});

export const patientUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  surname: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  assigned_doctor: z.string().optional(),
});

export const doctorCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  specialization: z.string().min(1, 'Specialization is required'),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Opening time must be in HH:mm format').optional(),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Closing time must be in HH:mm format').optional(),
  slotDuration: z.number().int().min(5).max(120).optional(), // Durée en minutes (entre 5 et 120)
});

export const doctorUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  surname: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  specialization: z.string().min(1).optional(),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Opening time must be in HH:mm format').optional(),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, 'Closing time must be in HH:mm format').optional(),
  slotDuration: z.number().int().min(5).max(120).optional(), // Durée en minutes (entre 5 et 120)
});

export const appointmentCreateSchema = z.object({
  appointedPatient: z.string().min(1, 'Patient ID is required').optional(),
  appointedPatientId: z.string().min(1, 'Patient ID is required').optional(),
  appointedDoctor: z.string().min(1, 'Doctor ID is required').optional(),
  appointedDoctorId: z.string().min(1, 'Doctor ID is required').optional(),
  date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, 'Date must be in dd-MM-yyyy format'),
  time: z.string().min(1, 'Time is required'),
  reason: z.string().min(1, 'Reason is required'),
  notes: z.string().optional(),
  slotId: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'DOCTOR_CREATED', 'COMPLETED']).optional(),
}).refine(
  (data) => data.appointedPatient || data.appointedPatientId,
  { message: 'Either appointedPatient or appointedPatientId is required', path: ['appointedPatient'] }
).refine(
  (data) => data.appointedDoctor || data.appointedDoctorId,
  { message: 'Either appointedDoctor or appointedDoctorId is required', path: ['appointedDoctor'] }
);

export const appointmentUpdateSchema = z.object({
  date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/).optional(),
  time: z.string().optional(),
  reason: z.string().min(1).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'DOCTOR_CREATED', 'COMPLETED']).optional(),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const registerPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

export const secretaryCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().optional(),
  phone: z.string().optional(),
  doctorIds: z.array(z.string()).optional(),
});

export const secretaryUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  surname: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  phone: z.string().optional(),
  doctorIds: z.array(z.string()).optional(),
});


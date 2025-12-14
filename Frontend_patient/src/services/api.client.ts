import { MOCK_PATIENTS, MOCK_DOCTORS, MOCK_APPOINTMENTS } from '../mocks/data';
import type { Appointment, Patient, Doctor } from '../types';

const USE_MOCKS = true; // Force use of mocks as API does not exist

export class ApiClient {
  private static async simulateDelay<T>(data: T, ms = 500): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), ms));
  }

  static async get<T>(endpoint: string): Promise<T> {
    if (USE_MOCKS) {
      console.log(`[MOCK API] GET ${endpoint}`);
      
      // Appointments
      if (endpoint.startsWith('/appointments/')) {
        // Get appointments for a patient
        const patientId = endpoint.split('/').pop();
        const appointments = MOCK_APPOINTMENTS.filter(a => a.appointedPatient === patientId);
        return this.simulateDelay({ appointments } as T);
      }
      
      // Patients
      if (endpoint.startsWith('/patients/')) {
        const patientId = endpoint.split('/').pop();
        const patient = MOCK_PATIENTS.find(p => p.patientId === patientId);
        if (!patient) throw new Error('Patient not found');
        return this.simulateDelay(patient as T);
      }

      // Doctors
      if (endpoint === '/doctors') {
        return this.simulateDelay(MOCK_DOCTORS as T);
      }
      if (endpoint.startsWith('/doctors/')) {
        const doctorId = endpoint.split('/').pop();
        const doctor = MOCK_DOCTORS.find(d => d.doctorId === doctorId);
        if (!doctor) throw new Error('Doctor not found');
        return this.simulateDelay(doctor as T);
      }
    }

    // Fallback to real fetch if we were not forcing mocks (unreachable code currently)
    throw new Error(`Endpoint ${endpoint} not mocked and API is disabled.`);
  }

  static async post<T>(endpoint: string, body: any): Promise<T> {
    if (USE_MOCKS) {
       console.log(`[MOCK API] POST ${endpoint}`, body);

       if (endpoint === '/appointments') {
         const newAppointment = {
           ...body,
           appointmentId: Math.random().toString(36).substr(2, 9),
           createdAt: new Date(),
           updatedAt: new Date(),
         };
         MOCK_APPOINTMENTS.push(newAppointment);
         return this.simulateDelay(newAppointment as T);
       }
    }
    throw new Error(`Endpoint ${endpoint} not mocked and API is disabled.`);
  }

  static async put<T>(endpoint: string, body: any): Promise<T> {
    if (USE_MOCKS) {
      console.log(`[MOCK API] PUT ${endpoint}`, body);

      if (endpoint.startsWith('/patients/')) {
        const patientId = endpoint.split('/').pop();
        const index = MOCK_PATIENTS.findIndex(p => p.patientId === patientId);
        if (index !== -1) {
          MOCK_PATIENTS[index] = { ...MOCK_PATIENTS[index], ...body };
          return this.simulateDelay(MOCK_PATIENTS[index] as T);
        }
      }
      
      if (endpoint.startsWith('/appointments/')) {
         const appointmentId = endpoint.split('/').pop();
         const index = MOCK_APPOINTMENTS.findIndex(a => a.appointmentId === appointmentId);
         if (index !== -1) {
           MOCK_APPOINTMENTS[index] = { ...MOCK_APPOINTMENTS[index], ...body };
           return this.simulateDelay(MOCK_APPOINTMENTS[index] as T);
         }
      }
    }
    throw new Error(`Endpoint ${endpoint} not mocked and API is disabled.`);
  }

  static async delete<T>(endpoint: string): Promise<T> {
     if (USE_MOCKS) {
       console.log(`[MOCK API] DELETE ${endpoint}`);
       if (endpoint.startsWith('/appointments/')) {
         const appointmentId = endpoint.split('/').pop();
         const index = MOCK_APPOINTMENTS.findIndex(a => a.appointmentId === appointmentId);
         if (index !== -1) {
           MOCK_APPOINTMENTS.splice(index, 1);
           return this.simulateDelay(undefined as T);
         }
       }
     }
     throw new Error(`Endpoint ${endpoint} not mocked and API is disabled.`);
  }
}

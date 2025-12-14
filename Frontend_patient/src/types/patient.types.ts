export interface Patient {
  patientId: string;
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  medicalHistory?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientUpdatePayload {
  firstName?: string;
  surname?: string;
  phone?: string;
  address?: string;
}

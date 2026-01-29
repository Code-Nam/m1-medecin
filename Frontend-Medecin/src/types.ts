export interface Doctor {
    doctorId: string;
    Surname: string;
    FirstName: string;
    specialization: string;
    email: string;
    phone: string;
}

export interface Patient {
    patientId: string;
    Surname: string;
    FirstName: string;
    email: string;
    phone: string;
    assigned_doctor: string;
}

export interface Appointment {
    appointmentId: string;
    appointedPatient: string;
    appointedDoctor: string;
    date: string; // format dd-MM-yyyy
    time: string; // format HH:MM
    reason: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'DOCTOR_CREATED' | 'COMPLETED';
    createdBy: 'patient' | 'doctor';
    patientName?: string;
    slotId?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

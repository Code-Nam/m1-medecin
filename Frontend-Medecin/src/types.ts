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
    status: 'confirmed' | 'pending' | 'cancelled' | 'doctor_created';
    createdBy: 'patient' | 'doctor';
}

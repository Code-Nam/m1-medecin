export interface AppointmentEmailData {
    patientName: string;
    patientEmail: string;
    doctorName: string;
    doctorTitle?: string;
    doctorSpecialization?: string;
    appointmentDate: string;
    appointmentTime: string;
    reason: string;
    notes?: string;
}

export interface IEmailService {
    /**
     * Send appointment reminder email (before appointment)
     */
    sendAppointmentReminder(data: AppointmentEmailData): Promise<void>;

    /**
     * Send appointment recap email (after appointment)
     */
    sendAppointmentRecap(data: AppointmentEmailData): Promise<void>;
}

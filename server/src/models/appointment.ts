export type AppointmentListItem = {
    id: string;
    appointedPatientId: string;
    appointedDoctorId: string;
    date: Date;
    time: string;
    reason?: string | null;
    status?: string | null;
    notes?: string | null;
};

export type AppointmentDetail = AppointmentListItem & {
    patient: any;
    doctor: any;
    availabilitySlotId?: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateAppointmentDTO = {
    appointedPatientId: string;
    appointedDoctorId: string;
    availabilitySlotId?: string | null;
    date: Date;
    time: string;
    reason?: string | null;
    notes?: string | null;
    status?: string | null;
};

export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>;

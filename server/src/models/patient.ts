// ...new patient model types...
export type PatientListItem = {
    id: string;
    firstName: string;
    surname: string;
    email: string;
    phone?: string | null;
    dateOfBirth?: Date | null;
    address?: string | null;
    assignedDoctor?: { id: string; firstName: string; surname: string } | null;
};

export type PatientDetail = PatientListItem & {
    createdAt: Date;
    updatedAt: Date;
    password?: string | null;
};

export type CreatePatientDTO = {
    firstName: string;
    surname: string;
    email: string;
    password?: string | null; // hashed
    phone?: string | null;
    dateOfBirth?: Date | null;
    address?: string | null;
    assignedDoctorId?: string | null;
};

export type UpdatePatientDTO = Partial<CreatePatientDTO>;

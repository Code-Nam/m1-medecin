export type DoctorListItem = {
    id: string;
    firstName: string;
    surname: string;
    email: string;
    phone?: string | null;
    title?: string | null;
    specialization?: string | null;
    openingTime?: string | null;
    closingTime?: string | null;
    slotDuration?: number | null;
};

export type DoctorDetail = DoctorListItem & {
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        patients: number;
        appointments: number;
    };
};

export type CreateDoctorDTO = {
    firstName: string;
    surname: string;
    email: string;
    password?: string | null; // hashed password expected
    phone?: string | null;
    title?: string | null;
    specialization: string;
    openingTime?: string | null;
    closingTime?: string | null;
    slotDuration?: number | null;
};

export type UpdateDoctorDTO = Partial<CreateDoctorDTO>;

export type CreateSecretaryDTO = {
    firstName: string;
    surname: string;
    email: string;
    password?: string | null;
    phone?: string | null;
    doctorConnections?: Array<{ doctorId: string }>;
};

export type UpdateSecretaryDTO = Partial<CreateSecretaryDTO> & {
    doctorConnections?: Array<{ doctorId: string }>;
};

export type SecretaryListItem = {
    id: string;
    secretaryId: string;
    firstName: string;
    surname: string;
    email: string;
    phone?: string | null;
    doctorConnections?: Array<{ doctorId: string }>;
};

export type SecretaryDetail = SecretaryListItem & {
    createdAt: Date;
    updatedAt: Date;
    doctors?: Array<{ doctor: { doctorId: string; firstName: string; surname: string } }>;
};

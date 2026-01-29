import type { PatientListItem, PatientDetail, CreatePatientDTO, UpdatePatientDTO } from "../../models/patient";

export interface IPatientRepository {
    findPatientById(id: string): Promise<PatientDetail | null>;
    findPatients(page?: number, pageSize?: number, where?: any): Promise<{ patients: PatientListItem[]; total: number }>;
    createPatient(data: CreatePatientDTO): Promise<PatientDetail>;
    updatePatient(id: string, data: UpdatePatientDTO): Promise<PatientDetail>;
    deletePatientById(id: string): Promise<PatientDetail>;
}

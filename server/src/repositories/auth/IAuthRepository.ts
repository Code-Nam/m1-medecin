export interface IAuthRepository {
    findPatientByEmail(email: string): Promise<any | null>;
    findDoctorByEmail(email: string): Promise<any | null>;
    findSecretaryByEmail(email: string): Promise<any | null>;
    createPatient(data: any): Promise<any>;
}

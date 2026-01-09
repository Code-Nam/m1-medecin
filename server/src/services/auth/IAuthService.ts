export interface IAuthService {
    registerPatient(patientData: any): Promise<any>;
    loginPatient(email: string, password: string): Promise<any>;
    loginDoctor(email: string, password: string): Promise<any>;
    loginSecretary(email: string, password: string): Promise<any>;
}

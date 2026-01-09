export interface IPatientService {
    getPatient(id: string): Promise<any>;
    getPatients(
        page?: number,
        pageSize?: number,
        doctorId?: string
    ): Promise<any>;
    createPatient(data: any): Promise<any>;
    updatePatient(id: string, data: any): Promise<any>;
    deletePatient(id: string): Promise<void>;
}

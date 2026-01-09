export interface IClinicService {
    getClinic(clinicId: string): Promise<any>;
    getClinics(page?: number, pageSize?: number): Promise<any>;
    createClinic(data: any): Promise<any>;
    updateClinic(clinicId: string, data: any): Promise<any>;
    deleteClinic(clinicId: string): Promise<void>;
}

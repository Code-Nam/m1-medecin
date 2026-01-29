export interface IClinicRepository {
    findClinicByExternalId(clinicId: string): Promise<any | null>;
    findClinicById(id: string): Promise<any | null>;
    findClinics(
        page?: number,
        pageSize?: number
    ): Promise<{ clinics: any[]; total: number }>;
    createClinic(data: any): Promise<any>;
    updateClinic(clinicId: string, data: any): Promise<any>;
    deleteClinicByExternalId(clinicId: string): Promise<any>;
}

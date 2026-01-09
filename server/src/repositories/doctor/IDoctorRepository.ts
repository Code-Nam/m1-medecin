import type { DoctorListItem, DoctorDetail, CreateDoctorDTO, UpdateDoctorDTO } from "../../models/doctor";

export interface IDoctorRepository {
    findDoctorById(id: string): Promise<DoctorDetail | null>;
    findDoctors(page?: number, pageSize?: number): Promise<{ doctors: DoctorDetail[]; total: number }>;
    findAllDoctors(): Promise<DoctorListItem[]>;
    createDoctor(data: CreateDoctorDTO): Promise<DoctorDetail>;
    updateDoctor(id: string, data: UpdateDoctorDTO): Promise<DoctorDetail>;
    deleteDoctorById(id: string): Promise<DoctorDetail>;
    findDoctorByExternalId(doctorId: string): Promise<any>;
    findPatientsByDoctorInternalId(
        internalDoctorId: string,
        page?: number,
        pageSize?: number
    ): Promise<{ patients: any[]; total: number }>;
}

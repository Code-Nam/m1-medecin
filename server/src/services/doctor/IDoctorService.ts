import type { IDoctorRepository } from "../../repositories/doctor/IDoctorRepository";

export interface IDoctorService {
    // define public methods used by controllers
    getDoctor(id: string): Promise<any>;
    getDoctors(page?: number, pageSize?: number): Promise<any>;
    getAllDoctors(): Promise<any[]>;
    createDoctor(data: any): Promise<any>;
    updateDoctor(id: string, data: any): Promise<any>;
    deleteDoctor(id: string): Promise<void>;
    getPatientsByDoctor(
        doctorId: string,
        page?: number,
        pageSize?: number
    ): Promise<any>;
}

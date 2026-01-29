export interface IAppointmentService {
    getAppointmentsByPatient(
        patientId: string,
        page?: number,
        pageSize?: number
    ): Promise<any>;
    getAppointmentsByDoctor(
        doctorId: string,
        page?: number,
        pageSize?: number
    ): Promise<any>;
    createAppointment(data: any): Promise<any>;
    updateAppointment(id: string, data: any): Promise<any>;
    deleteAppointment(id: string): Promise<void>;
    getAppointmentById(id: string): Promise<any>;
}

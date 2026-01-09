import type { AppointmentListItem, AppointmentDetail, CreateAppointmentDTO, UpdateAppointmentDTO } from "../../models/appointment";

export interface IAppointmentRepository {
    findAppointmentsByPatient(
        patientId: string,
        page?: number,
        pageSize?: number
    ): Promise<{ appointments: AppointmentListItem[]; total: number }>;
    findAppointmentsByDoctor(
        doctorId: string,
        page?: number,
        pageSize?: number
    ): Promise<{ appointments: AppointmentListItem[]; total: number }>;
    createAppointment(data: CreateAppointmentDTO): Promise<AppointmentDetail>;
    updateAppointment(id: string, data: UpdateAppointmentDTO): Promise<AppointmentDetail>;
    deleteAppointmentById(id: string): Promise<AppointmentDetail>;
    findAppointmentById(id: string): Promise<AppointmentDetail | null>;
    findAvailabilitySlotById(id: string): Promise<any>;
    updateAvailabilitySlot(id: string, data: any): Promise<any>;
    findAvailabilitySlotForDoctorAtTime(
        doctorId: string,
        dateStart: Date,
        dateEnd: Date,
        startTime: string
    ): Promise<any>;
}

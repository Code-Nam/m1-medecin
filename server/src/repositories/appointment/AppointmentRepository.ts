import prisma from "../../config/database";
import { logger } from "../../config/logger";
import type { IAppointmentRepository } from "./IAppointmentRepository";
import type {
    AppointmentListItem,
    AppointmentDetail,
    CreateAppointmentDTO,
    UpdateAppointmentDTO,
} from "../../models/appointment";

export class AppointmentRepository implements IAppointmentRepository {
    async findAppointmentsByPatient(
        patientId: string,
        page = 1,
        pageSize = 10,
    ): Promise<{ appointments: AppointmentListItem[]; total: number }> {
        const skip = (page - 1) * pageSize;
        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where: { appointedPatientId: patientId },
                skip,
                take: pageSize,
                include: {
                    doctor: {
                        select: {
                            id: true,
                            firstName: true,
                            surname: true,
                            specialization: true,
                        },
                    },
                },
                orderBy: [{ date: "desc" }, { time: "desc" }],
            }),
            prisma.appointment.count({
                where: { appointedPatientId: patientId },
            }),
        ]);
        return { appointments, total };
    }

    async findAppointmentsByDoctor(
        doctorId: string,
        page = 1,
        pageSize = 10,
    ): Promise<{ appointments: AppointmentListItem[]; total: number }> {
        const skip = (page - 1) * pageSize;
        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where: { appointedDoctorId: doctorId },
                skip,
                take: pageSize,
                include: {
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            surname: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
                orderBy: [{ date: "asc" }, { time: "asc" }],
            }),
            prisma.appointment.count({
                where: { appointedDoctorId: doctorId },
            }),
        ]);
        return { appointments, total };
    }

    async createAppointment(
        data: CreateAppointmentDTO,
    ): Promise<AppointmentDetail> {
        const created = await prisma.appointment.create({
            data: {
                appointedPatientId: data.appointedPatientId,
                appointedDoctorId: data.appointedDoctorId,
                availabilitySlotId: data.availabilitySlotId,
                date: data.date,
                time: data.time,
                reason: data.reason,
                notes: data.notes,
                status: (data.status as any) || "PENDING",
            },
            include: { patient: true, doctor: true },
        });
        logger.info(`REPOSITORY CREATE appointment id=${created.id}`);
        return created as any;
    }

    async updateAppointment(
        id: string,
        data: UpdateAppointmentDTO,
    ): Promise<AppointmentDetail> {
        const updateData: any = {};
        if (data.date !== undefined) updateData.date = data.date;
        if (data.time !== undefined) updateData.time = data.time;
        if (data.reason !== undefined) updateData.reason = data.reason;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.availabilitySlotId !== undefined)
            updateData.availabilitySlotId = data.availabilitySlotId;

        const updated = await prisma.appointment.update({
            where: { id },
            data: updateData,
            include: { patient: true, doctor: true },
        });
        logger.info(`REPOSITORY UPDATE appointment id=${id}`);
        return updated as any;
    }

    async deleteAppointmentById(id: string): Promise<AppointmentDetail> {
        const deleted = await prisma.appointment.delete({
            where: { id },
            include: { patient: true, doctor: true },
        });
        logger.info(`REPOSITORY DELETE appointment id=${id}`);
        return deleted as any;
    }

    async findAppointmentById(id: string): Promise<AppointmentDetail | null> {
        return prisma.appointment.findUnique({
            where: { id },
            include: { patient: true, doctor: true },
        });
    }

    async findAvailabilitySlotById(id: string) {
        return prisma.availabilitySlot.findUnique({ where: { id } });
    }

    async updateAvailabilitySlot(id: string, data: any) {
        const updated = await prisma.availabilitySlot.update({
            where: { id },
            data,
        });
        logger.info(`REPOSITORY UPDATE availabilitySlot id=${id}`);
        return updated;
    }

    async findAvailabilitySlotForDoctorAtTime(
        doctorId: string,
        dateStart: Date,
        dateEnd: Date,
        startTime: string,
    ) {
        return prisma.availabilitySlot.findFirst({
            where: {
                doctorId,
                date: { gte: dateStart, lte: dateEnd },
                startTime,
                isAvailable: true,
                isBooked: false,
            },
        });
    }
}

export const appointmentRepository = new AppointmentRepository();

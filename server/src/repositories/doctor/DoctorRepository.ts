import prisma from "../../config/database";
import { logger } from "../../config/logger";
import type { IDoctorRepository } from "../doctor/IDoctorRepository";
import type {
    DoctorListItem,
    DoctorDetail,
    CreateDoctorDTO,
    UpdateDoctorDTO,
} from "../../models/doctor";

const selectCommon = {
    id: true,
    firstName: true,
    surname: true,
    email: true,
    phone: true,
    title: true,
    specialization: true,
    openingTime: true,
    closingTime: true,
    slotDuration: true,
};

const selectDetailed = {
    ...selectCommon,
    createdAt: true,
    updatedAt: true,
    _count: {
        select: {
            patients: true,
            appointments: true,
        },
    },
};

export class DoctorRepository implements IDoctorRepository {
    async findDoctorById(id: string): Promise<DoctorDetail | null> {
        return prisma.doctor.findUnique({
            where: { id },
            select: selectDetailed,
        });
    }

    async findDoctors(
        page = 1,
        pageSize = 10,
    ): Promise<{ doctors: DoctorDetail[]; total: number }> {
        const skip = (page - 1) * pageSize;
        const [doctors, total] = await Promise.all([
            prisma.doctor.findMany({
                skip,
                take: pageSize,
                select: selectDetailed,
                orderBy: { createdAt: "desc" },
            }),
            prisma.doctor.count(),
        ]);
        return { doctors, total };
    }

    async findAllDoctors(): Promise<DoctorListItem[]> {
        return prisma.doctor.findMany({
            select: selectCommon,
            orderBy: { surname: "asc" },
        });
    }

    async createDoctor(data: CreateDoctorDTO): Promise<DoctorDetail> {
        const created = await prisma.doctor.create({
            data: {
                firstName: data.firstName,
                surname: data.surname,
                email: data.email,
                password: data.password as string,
                phone: data.phone,
                title: data.title,
                specialization: data.specialization,
                openingTime: data.openingTime || undefined,
                closingTime: data.closingTime || undefined,
                slotDuration: data.slotDuration || undefined,
            },
            select: selectDetailed,
        });

        logger.info(
            `REPOSITORY CREATE doctor id=${created.id} email=${created.email}`,
        );
        return created;
    }

    async updateDoctor(
        id: string,
        data: UpdateDoctorDTO,
    ): Promise<DoctorDetail> {
        const updated = await prisma.doctor.update({
            where: { id },
            data: data as any,
            select: selectDetailed,
        });
        logger.info(`REPOSITORY UPDATE doctor id=${id}`);
        return updated;
    }

    async deleteDoctorById(id: string): Promise<DoctorDetail> {
        const deleted = await prisma.doctor.delete({ where: { id } });
        logger.info(`REPOSITORY DELETE doctor id=${id}`);
        return deleted;
    }

    async findPatientsByDoctorInternalId(
        internalDoctorId: string,
        page = 1,
        pageSize = 10,
    ): Promise<{ patients: any[]; total: number }> {
        const skip = (page - 1) * pageSize;
        const [patients, total] = await Promise.all([
            prisma.patient.findMany({
                where: { assignedDoctorId: internalDoctorId },
                skip,
                take: pageSize,
                select: {
                    id: true,
                    firstName: true,
                    surname: true,
                    email: true,
                    phone: true,
                    dateOfBirth: true,
                    address: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.patient.count({
                where: { assignedDoctorId: internalDoctorId },
            }),
        ]);

        return { patients, total };
    }
}

export const doctorRepository = new DoctorRepository();

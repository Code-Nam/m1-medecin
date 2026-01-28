import prisma from "../../config/database";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
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
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `doctor by id=${id}`,
            ),
        );
        const doctor = await prisma.doctor.findUnique({
            where: { id },
            select: selectDetailed,
        });
        if (doctor) {
            logger.info(
                formatLogMessage(
                    LogLayer.REPOSITORY,
                    LogOperation.FOUND,
                    `doctor id=${id}`,
                ),
            );
        } else {
            logger.warn(
                formatLogMessage(
                    LogLayer.REPOSITORY,
                    LogOperation.NOT_FOUND,
                    `doctor id=${id}`,
                ),
            );
        }
        return doctor;
    }

    async findDoctors(
        page = 1,
        pageSize = 10,
    ): Promise<{ doctors: DoctorDetail[]; total: number }> {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `doctors page=${page} pageSize=${pageSize}`,
            ),
        );
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
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FOUND,
                `${doctors.length} doctors`,
            ),
        );
        return { doctors, total };
    }

    async findAllDoctors(): Promise<DoctorListItem[]> {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `all doctors`,
            ),
        );
        const doctors = await prisma.doctor.findMany({
            select: selectCommon,
            orderBy: { surname: "asc" },
        });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FOUND,
                `${doctors.length} doctors`,
            ),
        );
        return doctors;
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
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.CREATE,
                `doctor id=${created.id} email=${created.email}`,
            ),
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
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.UPDATE,
                `doctor id=${id}`,
            ),
        );
        return updated;
    }

    async deleteDoctorById(id: string): Promise<DoctorDetail> {
        const deleted = await prisma.doctor.delete({ where: { id } });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.DELETE,
                `doctor id=${id}`,
            ),
        );
        return deleted;
    }

    async findPatientsByDoctorInternalId(
        internalDoctorId: string,
        page = 1,
        pageSize = 10,
    ): Promise<{ patients: any[]; total: number }> {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `patients by doctor id=${internalDoctorId} page=${page} pageSize=${pageSize}`,
            ),
        );
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
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FOUND,
                `${patients.length} patients for doctor id=${internalDoctorId}`,
            ),
        );
        return { patients, total };
    }
}

export const doctorRepository = new DoctorRepository();

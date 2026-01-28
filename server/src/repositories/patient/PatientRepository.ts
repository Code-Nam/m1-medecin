import prisma from "../../config/database";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import type { IPatientRepository } from "./IPatientRepository";
import type {
    PatientDetail,
    PatientListItem,
    CreatePatientDTO,
    UpdatePatientDTO,
} from "../../models/patient";

export class PatientRepository implements IPatientRepository {
    async findPatientById(id: string): Promise<PatientDetail | null> {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `patient by id=${id}`,
            ),
        );
        const patient = await prisma.patient.findUnique({
            where: { id },
            include: {
                assignedDoctor: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        specialization: true,
                    },
                },
            },
        });
        if (patient) {
            logger.info(
                formatLogMessage(
                    LogLayer.REPOSITORY,
                    LogOperation.FOUND,
                    `patient id=${id}`,
                ),
            );
        } else {
            logger.warn(
                formatLogMessage(
                    LogLayer.REPOSITORY,
                    LogOperation.NOT_FOUND,
                    `patient id=${id}`,
                ),
            );
        }
        return patient;
    }

    async findPatients(
        page = 1,
        pageSize = 10,
        where: any = {},
    ): Promise<{ patients: PatientListItem[]; total: number }> {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `patients page=${page} pageSize=${pageSize}`,
            ),
        );
        const skip = (page - 1) * pageSize;
        const [patients, total] = await Promise.all([
            prisma.patient.findMany({
                where,
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
                    assignedDoctor: {
                        select: { id: true, firstName: true, surname: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.patient.count({ where }),
        ]);
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FOUND,
                `${patients.length} patients`,
            ),
        );
        return { patients, total };
    }

    async createPatient(data: CreatePatientDTO): Promise<PatientDetail> {
        const created = await prisma.patient.create({
            data: {
                firstName: data.firstName,
                surname: data.surname,
                email: data.email,
                password: data.password,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth,
                address: data.address,
                assignedDoctorId: data.assignedDoctorId,
            },
            include: {
                assignedDoctor: {
                    select: { id: true, firstName: true, surname: true },
                },
            },
        });

        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.CREATE,
                `patient id=${created.id} email=${created.email}`,
            ),
        );
        return created;
    }

    async updatePatient(
        id: string,
        data: UpdatePatientDTO,
    ): Promise<PatientDetail> {
        const updated = await prisma.patient.update({
            where: { id },
            data,
            include: {
                assignedDoctor: {
                    select: { id: true, firstName: true, surname: true },
                },
            },
        });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.UPDATE,
                `patient id=${id}`,
            ),
        );
        return updated;
    }

    async deletePatientById(id: string): Promise<PatientDetail> {
        const deleted = await prisma.patient.delete({ where: { id } });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.DELETE,
                `patient id=${id}`,
            ),
        );
        return deleted;
    }
}

export const patientRepository = new PatientRepository();

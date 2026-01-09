import prisma from "../../config/database";
import { logger } from "../../config/logger";
import type { IPatientRepository } from "./IPatientRepository";
import type { PatientDetail, PatientListItem, CreatePatientDTO, UpdatePatientDTO } from "../../models/patient";

export class PatientRepository implements IPatientRepository {
    async findPatientById(id: string): Promise<PatientDetail | null> {
        return prisma.patient.findUnique({
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
    }

    async findPatients(page = 1, pageSize = 10, where: any = {}): Promise<{ patients: PatientListItem[]; total: number }> {
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
            `REPOSITORY CREATE patient id=${created.id} email=${created.email}`
        );
        return created;
    }

    async updatePatient(id: string, data: UpdatePatientDTO): Promise<PatientDetail> {
        const updated = await prisma.patient.update({
            where: { id },
            data,
            include: {
                assignedDoctor: {
                    select: { id: true, firstName: true, surname: true },
                },
            },
        });
        logger.info(`REPOSITORY UPDATE patient id=${id}`);
        return updated;
    }

    async deletePatientById(id: string): Promise<PatientDetail> {
        const deleted = await prisma.patient.delete({ where: { id } });
        logger.info(`REPOSITORY DELETE patient id=${id}`);
        return deleted;
    }
}

export const patientRepository = new PatientRepository();

import prisma from "../../config/database";
import type { CreateSecretaryDTO, UpdateSecretaryDTO, SecretaryListItem, SecretaryDetail } from "../../models/secretary";
import { logger } from "../../config/logger";
import type { ISecretaryRepository } from "./ISecretaryRepository";

export class SecretaryRepository implements ISecretaryRepository {
    async findSecretaryByExternalId(secretaryId: string): Promise<SecretaryDetail | null> {
        return prisma.secretary.findUnique({
            where: { secretaryId },
            include: {
                doctors: {
                    include: {
                        doctor: {
                            select: {
                                doctorId: true,
                                firstName: true,
                                surname: true,
                                title: true,
                                specialization: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findSecretaryById(id: string): Promise<SecretaryDetail | null> {
        return prisma.secretary.findUnique({
            where: { id },
            include: {
                doctors: {
                    include: {
                        doctor: {
                            select: {
                                doctorId: true,
                                firstName: true,
                                surname: true,
                                title: true,
                                specialization: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findSecretaries(page = 1, pageSize = 10): Promise<{ secretaries: SecretaryListItem[]; total: number }> {
        const skip = (page - 1) * pageSize;
        const [secretaries, total] = await Promise.all([
            prisma.secretary.findMany({
                skip,
                take: pageSize,
                select: {
                    secretaryId: true,
                    firstName: true,
                    surname: true,
                    email: true,
                    phone: true,
                    doctors: {
                        include: {
                            doctor: {
                                select: {
                                    doctorId: true,
                                    firstName: true,
                                    surname: true,
                                    title: true,
                                    specialization: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.secretary.count(),
        ]);
        return { secretaries, total };
    }

    async createSecretary(data: CreateSecretaryDTO): Promise<SecretaryDetail> {
        const secretary = await prisma.secretary.create({
            data: {
                firstName: data.firstName,
                surname: data.surname,
                email: data.email,
                password: data.password as string,
                phone: data.phone,
                doctors: {
                    create: data.doctorConnections || [],
                },
            },
            include: {
                doctors: {
                    include: {
                        doctor: {
                            select: {
                                doctorId: true,
                                firstName: true,
                                surname: true,
                                title: true,
                                specialization: true,
                            },
                        },
                    },
                },
            },
        });

        logger.info(
            `REPOSITORY CREATE secretary id=${secretary.id} email=${secretary.email}`
        );
        return secretary;
    }

    async updateSecretary(secretaryId: string, data: UpdateSecretaryDTO): Promise<SecretaryDetail> {
        const updated = await prisma.secretary.update({
            where: { secretaryId },
            data: data as any,
            include: {
                doctors: {
                    include: {
                        doctor: {
                            select: {
                                doctorId: true,
                                firstName: true,
                                surname: true,
                                title: true,
                                specialization: true,
                            },
                        },
                    },
                },
            },
        });

        logger.info(`REPOSITORY UPDATE secretary id=${updated.id}`);
        return updated;
    }

    async deleteSecretaryByExternalId(secretaryId: string): Promise<SecretaryDetail> {
        const deleted = await prisma.secretary.delete({
            where: { secretaryId },
        });
        logger.info(`REPOSITORY DELETE secretary id=${deleted.id}`);
        return deleted;
    }

    async findSecretariesByDoctorExternalId(doctorId: string): Promise<SecretaryListItem[] | null> {
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId },
            include: {
                secretaries: {
                    include: {
                        secretary: {
                            select: {
                                secretaryId: true,
                                firstName: true,
                                surname: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        });

        return doctor?.secretaries.map((sd: any) => sd.secretary) || null;
    }

    async countSecretaries() {
        return prisma.secretary.count();
    }

    async findDoctorByExternalId(doctorId: string) {
        return prisma.doctor.findUnique({ where: { doctorId } });
    }

    async removeDoctorRelationsForSecretary(secretaryInternalId: string) {
        const res = await prisma.secretaryDoctor.deleteMany({
            where: { secretaryId: secretaryInternalId },
        });
        logger.info(
            `REPOSITORY UPDATE secretary relations cleared for id=${secretaryInternalId}`
        );
        return res;
    }
}

export const secretaryRepository = new SecretaryRepository();

import prisma from "../../config/database";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import type {
    CreateSecretaryDTO,
    UpdateSecretaryDTO,
    SecretaryListItem,
    SecretaryDetail,
} from "../../models/secretary";
import { logger } from "../../config/logger";
import type { ISecretaryRepository } from "./ISecretaryRepository";

export class SecretaryRepository implements ISecretaryRepository {
    async findSecretaryById(id: string): Promise<SecretaryDetail | null> {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `secretary by id=${id}`,
            ),
        );
        const secretary = await prisma.secretary.findUnique({
            where: { id },
            include: {
                doctors: {
                    include: {
                        doctor: {
                            select: {
                                id: true,
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
        if (secretary) {
            logger.info(
                formatLogMessage(
                    LogLayer.REPOSITORY,
                    LogOperation.FOUND,
                    `secretary id=${id}`,
                ),
            );
        } else {
            logger.warn(
                formatLogMessage(
                    LogLayer.REPOSITORY,
                    LogOperation.NOT_FOUND,
                    `secretary id=${id}`,
                ),
            );
        }
        return secretary;
    }

    async findSecretaries(
        page = 1,
        pageSize = 10,
    ): Promise<{ secretaries: SecretaryListItem[]; total: number }> {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `secretaries page=${page} pageSize=${pageSize}`,
            ),
        );
        const skip = (page - 1) * pageSize;
        const [secretaries, total] = await Promise.all([
            prisma.secretary.findMany({
                skip,
                take: pageSize,
                select: {
                    id: true,
                    firstName: true,
                    surname: true,
                    email: true,
                    phone: true,
                    doctors: {
                        include: {
                            doctor: {
                                select: {
                                    id: true,
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
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FOUND,
                `${secretaries.length} secretaries`,
            ),
        );
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
                                id: true,
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
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.CREATE,
                `secretary id=${secretary.id} email=${secretary.email}`,
            ),
        );
        return secretary;
    }

    async updateSecretary(
        id: string,
        data: UpdateSecretaryDTO,
    ): Promise<SecretaryDetail> {
        const updated = await prisma.secretary.update({
            where: { id },
            data: data as any,
            include: {
                doctors: {
                    include: {
                        doctor: {
                            select: {
                                id: true,
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
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.UPDATE,
                `secretary id=${updated.id}`,
            ),
        );
        return updated;
    }

    async deleteSecretaryById(id: string): Promise<SecretaryDetail> {
        const deleted = await prisma.secretary.delete({
            where: { id },
        });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.DELETE,
                `secretary id=${deleted.id}`,
            ),
        );
        return deleted;
    }

    async countSecretaries() {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.COUNT,
                `secretaries`,
            ),
        );
        const count = await prisma.secretary.count();
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FOUND,
                `${count} secretaries`,
            ),
        );
        return count;
    }

    async removeDoctorRelationsForSecretary(secretaryInternalId: string) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.REMOVE,
                `doctor relations for secretary id=${secretaryInternalId}`,
            ),
        );
        const res = await prisma.secretaryDoctor.deleteMany({
            where: { secretaryId: secretaryInternalId },
        });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.REMOVED,
                `${res.count} doctor relations for secretary id=${secretaryInternalId}`,
            ),
        );
        return res;
    }
}

export const secretaryRepository = new SecretaryRepository();

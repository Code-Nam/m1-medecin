import prisma from "../../config/database";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import type { IAuthRepository } from "./IAuthRepository";

export class AuthRepository implements IAuthRepository {
    async findPatientByEmail(email: string) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `patient by email=${email}`,
            ),
        );
        return prisma.patient.findUnique({ where: { email } });
    }

    async findDoctorByEmail(email: string) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `doctor by email=${email}`,
            ),
        );
        return prisma.doctor.findUnique({ where: { email } });
    }

    async findSecretaryByEmail(email: string) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `secretary by email=${email}`,
            ),
        );
        return prisma.secretary.findUnique({
            where: { email },
            include: { doctors: { include: { doctor: true } } },
        });
    }

    async createPatient(data: any) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.CREATE,
                `patient email=${data.email}`,
            ),
        );
        const created = await prisma.patient.create({ data });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.CREATED,
                `patient id=${created.id} email=${created.email}`,
            ),
        );
        return created;
    }
}

export const authRepository = new AuthRepository();

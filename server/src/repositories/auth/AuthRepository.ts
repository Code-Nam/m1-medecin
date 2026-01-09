import prisma from "../../config/database";
import { logger } from "../../config/logger";
import type { IAuthRepository } from "./IAuthRepository";

export class AuthRepository implements IAuthRepository {
    async findPatientByEmail(email: string) {
        return prisma.patient.findUnique({ where: { email } });
    }

    async findDoctorByEmail(email: string) {
        return prisma.doctor.findUnique({ where: { email } });
    }

    async findSecretaryByEmail(email: string) {
        return prisma.secretary.findUnique({
            where: { email },
            include: { doctors: { include: { doctor: true } } },
        });
    }

    async createPatient(data: any) {
        const created = await prisma.patient.create({ data });
        logger.info(
            `REPOSITORY CREATE patient id=${created.id} email=${created.email}`
        );
        return created;
    }
}

export const authRepository = new AuthRepository();

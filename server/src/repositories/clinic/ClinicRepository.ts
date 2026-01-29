import prisma from "../../config/database";
import { logger } from "../../config/logger";
import type { IClinicRepository } from "./IClinicRepository";

export class ClinicRepository implements IClinicRepository {
    async findClinicByExternalId(clinicId: string) {
        return prisma.clinic.findUnique({
            where: { clinicId },
            include: { doctors: true, secretaries: true },
        });
    }

    async findClinicById(id: string) {
        return prisma.clinic.findUnique({
            where: { id },
            include: { doctors: true, secretaries: true },
        });
    }

    async findClinics(page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const [clinics, total] = await Promise.all([
            prisma.clinic.findMany({
                skip,
                take: pageSize,
                include: {
                    _count: { select: { doctors: true, secretaries: true } },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.clinic.count(),
        ]);
        return { clinics, total };
    }

    async createClinic(data: any) {
        const created = await prisma.clinic.create({ data });
        logger.info(`REPOSITORY CREATE clinic id=${created.clinicId}`);
        return created;
    }

    async updateClinic(clinicId: string, data: any) {
        const updated = await prisma.clinic.update({
            where: { clinicId },
            data,
        });
        logger.info(`REPOSITORY UPDATE clinic id=${updated.id}`);
        return updated;
    }

    async deleteClinicByExternalId(clinicId: string) {
        const deleted = await prisma.clinic.delete({ where: { clinicId } });
        logger.info(`REPOSITORY DELETE clinic id=${deleted.id}`);
        return deleted;
    }
}

export const clinicRepository = new ClinicRepository();

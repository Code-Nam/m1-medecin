import prisma from "../../config/database";
import type { IAvailabilityRepository } from "./IAvailabilityRepository";
import { logger } from "../../config/logger";

export class AvailabilityRepository implements IAvailabilityRepository {
    async findDoctorById(id: string) {
        return prisma.doctor.findUnique({ where: { id } });
    }

    async findAvailabilitySlotByUnique(
        doctorId: string,
        date: Date,
        startTime: string
    ) {
        return prisma.availabilitySlot.findUnique({
            where: { doctorId_date_startTime: { doctorId, date, startTime } },
        });
    }

    async createAvailabilitySlots(slots: any[]) {
        return prisma.availabilitySlot.createMany({
            data: slots,
            skipDuplicates: true,
        });
    }

    async findAvailabilitySlotsForDoctorInRange(
        doctorId: string,
        dateStart: Date,
        dateEnd: Date
    ) {
        return prisma.availabilitySlot.findMany({
            where: { doctorId, date: { gte: dateStart, lte: dateEnd } },
            orderBy: { startTime: "asc" },
        });
    }

    async updateAvailabilitySlot(id: string, data: any) {
        return prisma.availabilitySlot.update({ where: { id }, data });
    }

    async deletePastAvailabilitySlots(before: Date) {
        return prisma.availabilitySlot.deleteMany({
            where: { date: { lt: before } },
        });
    }

    async findDoctorsSample() {
        return prisma.doctor.findMany({
            select: { id: true, firstName: true, surname: true },
            take: 5,
        });
    }
}

export const availabilityRepository = new AvailabilityRepository();

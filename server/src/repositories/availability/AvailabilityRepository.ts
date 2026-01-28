import prisma from "../../config/database";
import type { IAvailabilityRepository } from "./IAvailabilityRepository";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";

export class AvailabilityRepository implements IAvailabilityRepository {
    async findDoctorById(id: string) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `doctor by id=${id}`,
            ),
        );
        return prisma.doctor.findUnique({ where: { id } });
    }

    async findAvailabilitySlotByUnique(
        doctorId: string,
        date: Date,
        startTime: string,
    ) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `availabilitySlot by unique key doctor=${doctorId} date=${date} time=${startTime}`,
            ),
        );
        return prisma.availabilitySlot.findUnique({
            where: { doctorId_date_startTime: { doctorId, date, startTime } },
        });
    }

    async createAvailabilitySlots(slots: any[]) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.CREATE,
                `${slots.length} availabilitySlots`,
            ),
        );
        const result = await prisma.availabilitySlot.createMany({
            data: slots,
            skipDuplicates: true,
        });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.CREATED,
                `${result.count} availabilitySlots`,
            ),
        );
        return result;
    }

    async findAvailabilitySlotsForDoctorInRange(
        doctorId: string,
        dateStart: Date,
        dateEnd: Date,
    ) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `availabilitySlots for doctor=${doctorId} from ${dateStart} to ${dateEnd}`,
            ),
        );
        const slots = await prisma.availabilitySlot.findMany({
            where: { doctorId, date: { gte: dateStart, lte: dateEnd } },
            orderBy: { startTime: "asc" },
        });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FOUND,
                `${slots.length} availabilitySlots`,
            ),
        );
        return slots;
    }

    async updateAvailabilitySlot(id: string, data: any) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.UPDATE,
                `availabilitySlot id=${id}`,
            ),
        );
        return prisma.availabilitySlot.update({ where: { id }, data });
    }

    async deletePastAvailabilitySlots(before: Date) {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.DELETE,
                `past availabilitySlots before ${before}`,
            ),
        );
        const result = await prisma.availabilitySlot.deleteMany({
            where: { date: { lt: before } },
        });
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.DELETED,
                `${result.count} past availabilitySlots`,
            ),
        );
        return result;
    }

    async findDoctorsSample() {
        logger.info(
            formatLogMessage(
                LogLayer.REPOSITORY,
                LogOperation.FIND,
                `doctors sample`,
            ),
        );
        return prisma.doctor.findMany({
            select: { id: true, firstName: true, surname: true },
            take: 5,
        });
    }
}

export const availabilityRepository = new AvailabilityRepository();

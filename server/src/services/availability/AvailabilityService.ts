import { logger } from "../../config/logger";
import { availabilityRepository } from "../../repositories/availability/AvailabilityRepository";
import type { IAvailabilityService } from "./IAvailabilityService";

export class AvailabilityService implements IAvailabilityService {
    /**
     * Génère les créneaux de disponibilité pour un médecin sur une période donnée
     */
    async generateSlotsForDoctor(
        doctorId: string,
        startDate: Date,
        endDate: Date,
    ) {
        const doctor = await availabilityRepository.findDoctorById(doctorId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const slots = [];
        const currentDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);

        const [openingHour, openingMinute] = doctor.openingTime
            .split(":")
            .map(Number);
        const [closingHour, closingMinute] = doctor.closingTime
            .split(":")
            .map(Number);
        const slotDuration = doctor.slotDuration || 30;

        // Validate time values
        if (
            openingHour === undefined ||
            openingMinute === undefined ||
            closingHour === undefined ||
            closingMinute === undefined
        ) {
            throw new Error("Invalid doctor opening or closing time format");
        }

        while (currentDate <= endDate) {
            const date = new Date(currentDate);

            let currentHour: number = openingHour;
            let currentMin: number = openingMinute;

            while (
                currentHour < closingHour ||
                (currentHour === closingHour && currentMin < closingMinute)
            ) {
                const startTime = `${String(currentHour).padStart(
                    2,
                    "0",
                )}:${String(currentMin).padStart(2, "0")}`;

                let endHour: number = currentHour;
                let endMin: number = currentMin + slotDuration;
                if (endMin >= 60) {
                    endHour += Math.floor(endMin / 60);
                    endMin = endMin % 60;
                }
                const endTime = `${String(endHour).padStart(2, "0")}:${String(
                    endMin,
                ).padStart(2, "0")}`;

                if (
                    endHour > closingHour ||
                    (endHour === closingHour && endMin > closingMinute)
                ) {
                    break;
                }

                const existingSlot =
                    await availabilityRepository.findAvailabilitySlotByUnique(
                        doctor.id,
                        date,
                        startTime,
                    );

                if (!existingSlot) {
                    slots.push({
                        doctorId: doctor.id,
                        date: date,
                        startTime: startTime,
                        endTime: endTime,
                        isAvailable: true,
                        isBooked: false,
                    });
                }

                currentMin += slotDuration;
                if (currentMin >= 60) {
                    currentHour += Math.floor(currentMin / 60);
                    currentMin = currentMin % 60;
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (slots.length > 0) {
            await availabilityRepository.createAvailabilitySlots(slots);
            logger.info(
                `Generated ${slots.length} availability slots for doctor ${doctorId}`,
            );
        }

        return slots.length;
    }

    async getAvailableSlots(doctorId: string, date: Date) {
        logger.info(`🔍 Recherche du médecin avec ID: ${doctorId}`);
        const doctor = await availabilityRepository.findDoctorById(doctorId);

        if (!doctor) {
            logger.error(`❌ Médecin non trouvé avec ID: ${doctorId}`);
            const allDoctors = await availabilityRepository.findDoctorsSample();
            logger.info(`📋 Médecins disponibles (échantillon):`, allDoctors);
            throw new Error("Doctor not found");
        }

        logger.info(
            `✅ Médecin trouvé: ${doctor.firstName} ${doctor.surname} (ID: ${doctor.id})`,
        );

        const dateStart = new Date(date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59, 999);

        const existingSlots =
            (
                await availabilityRepository.findAvailabilitySlotsForDoctorInRange(
                    doctor.id,
                    dateStart,
                    dateEnd,
                )
            )[0] || null;

        if (!existingSlots) {
            await this.generateSlotsForDoctor(doctorId, dateStart, dateEnd);
        }

        const slots =
            await availabilityRepository.findAvailabilitySlotsForDoctorInRange(
                doctor.id,
                dateStart,
                dateEnd,
            );

        return slots;
    }

    async bookSlot(slotId: string) {
        await availabilityRepository.updateAvailabilitySlot(slotId, {
            isBooked: true,
            isAvailable: false,
        });
    }

    async releaseSlot(slotId: string) {
        await availabilityRepository.updateAvailabilitySlot(slotId, {
            isBooked: false,
            isAvailable: true,
        });
    }

    async cleanupPastSlots() {
        const now = new Date();
        const deleted =
            await availabilityRepository.deletePastAvailabilitySlots(now);
        logger.info(`Cleaned up ${deleted.count} past availability slots`);
        return deleted.count;
    }
}

export const availabilityService = new AvailabilityService();

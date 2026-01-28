import type { Response } from "express";
import { availabilityService } from "../../services/availability/AvailabilityService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IAvailabilityController } from "./IAvailabilityController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";

export class AvailabilityController implements IAvailabilityController {
    async generateSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GENERATE,
                    `slots for doctor id=${id} user=${req.user?.id}`,
                ),
            );
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const { startDate, endDate } = req.body;

            if (!startDate || !endDate) {
                res.status(400).json({
                    error: "startDate and endDate are required",
                });
                return;
            }

            const count = await availabilityService.generateSlotsForDoctor(
                id as string,
                new Date(startDate),
                new Date(endDate),
            );

            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Generated ${count} slots for doctor ${id}`,
                ),
            );
            res.json({
                message: `Generated ${count} availability slots`,
                count,
            });
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `generating slots: ${error.message}`,
                ),
            );
            res.status(400).json({
                error: error.message || "Failed to generate slots",
            });
        }
    }

    async getAvailableSlots(
        req: AuthRequest | any,
        res: Response,
    ): Promise<void> {
        try {
            const { id } = req.params;
            const { date } = req.query;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `available slots for doctor id=${id} date=${date}`,
                ),
            );
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const doctorId = id as string;

            if (!date) {
                res.status(400).json({
                    error: "date query parameter is required",
                });
                return;
            }

            const slots = await availabilityService.getAvailableSlots(
                doctorId,
                new Date(date as string),
            );

            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Found ${slots.length} available slots for doctor ${id}`,
                ),
            );
            res.json({
                slots: slots.map((slot: any) => ({
                    slotId: slot.id,
                    date: slot.date,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: slot.isAvailable,
                    isBooked: slot.isBooked,
                })),
            });
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting available slots: ${error.message}`,
                ),
            );
            res.status(400).json({
                error: error.message || "Failed to get available slots",
            });
        }
    }

    async cleanupPastSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.CLEANUP,
                    `past slots user=${req.user?.id} role=${req.user?.role}`,
                ),
            );
            if (req.user?.role !== "ADMIN" && req.user?.role !== "DOCTOR") {
                logger.warn(
                    formatLogMessage(
                        LogLayer.CONTROLLER,
                        LogOperation.FORBIDDEN,
                        `User ${req.user?.id} with role ${req.user?.role} tried to cleanup slots`,
                    ),
                );
                res.status(403).json({ error: "Forbidden" });
                return;
            }

            const count = await availabilityService.cleanupPastSlots();
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Cleaned up ${count} past slots`,
                ),
            );
            res.json({ message: `Cleaned up ${count} past slots`, count });
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `cleaning up slots: ${error.message}`,
                ),
            );
            res.status(500).json({
                error: error.message || "Failed to cleanup slots",
            });
        }
    }
}

export const availabilityController = new AvailabilityController();

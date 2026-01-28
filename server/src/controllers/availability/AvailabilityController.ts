import type { Response } from "express";
import { availabilityService } from "../../services/availability/AvailabilityService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IAvailabilityController } from "./IAvailabilityController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import {
    ResponseHandler,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
} from "../../utils/responseHandler";

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
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }
            const { startDate, endDate } = req.body;

            if (!startDate || !endDate) {
                return ResponseHandler.badRequest(
                    res,
                    "startDate and endDate are required",
                );
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
            ResponseHandler.success(res, {
                message: `Generated ${count} availability slots`,
                count,
            });
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "generating slots",
                req.user?.id,
            );
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
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }
            const doctorId = id as string;

            if (!date) {
                return ResponseHandler.badRequest(
                    res,
                    "date query parameter is required",
                );
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
            ResponseHandler.success(res, {
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
            ResponseHandler.handle(
                error,
                res,
                "getting available slots",
                req.user?.id,
            );
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
                return ResponseHandler.forbidden(
                    res,
                    "Only admins and doctors can cleanup slots",
                );
            }

            const count = await availabilityService.cleanupPastSlots();
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Cleaned up ${count} past slots`,
                ),
            );
            ResponseHandler.success(res, {
                message: `Cleaned up ${count} past slots`,
                count,
            });
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "cleaning up slots",
                req.user?.id,
            );
        }
    }
}

export const availabilityController = new AvailabilityController();

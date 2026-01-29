import type { Response } from "express";
import { availabilityService } from "../../services/availability/AvailabilityService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IAvailabilityController } from "./IAvailabilityController";
import { ResponseHandler } from "../../utils/responseHandler";
import {
    validateRequiredParam,
    validateRequiredParams,
    checkRoles,
    logOperation,
    logSuccess,
} from "../helpers";
import { LogOperation } from "../../errors";

export class AvailabilityController implements IAvailabilityController {
    async generateSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logOperation(
                LogOperation.GENERATE,
                `slots for doctor id=${id}`,
                req.user?.id,
            );
            if (!validateRequiredParam(res, "id", id)) return;

            const { startDate, endDate } = req.body;

            if (
                !validateRequiredParams(res, [
                    { name: "startDate", value: startDate },
                    { name: "endDate", value: endDate },
                ])
            )
                return;

            const count = await availabilityService.generateSlotsForDoctor(
                id as string,
                new Date(startDate),
                new Date(endDate),
            );

            logSuccess(`Generated ${count} slots for doctor ${id}`);
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
            logOperation(
                LogOperation.GET,
                `available slots for doctor id=${id} date=${date}`,
            );
            if (!validateRequiredParam(res, "id", id)) return;

            const doctorId = id as string;

            if (!validateRequiredParam(res, "date", date)) return;

            const slots = await availabilityService.getAvailableSlots(
                doctorId,
                new Date(date as string),
            );

            logSuccess(
                `Found ${slots.length} available slots for doctor ${id}`,
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
            logOperation(
                LogOperation.CLEANUP,
                `past slots role=${req.user?.role}`,
                req.user?.id,
            );
            if (
                !checkRoles(
                    req,
                    res,
                    ["ADMIN", "DOCTOR"],
                    "Only admins and doctors can cleanup slots",
                )
            )
                return;

            const count = await availabilityService.cleanupPastSlots();
            logSuccess(`Cleaned up ${count} past slots`);
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

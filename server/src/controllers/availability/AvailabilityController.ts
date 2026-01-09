import type { Response } from "express";
import { availabilityService } from "../../services/availability/AvailabilityService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IAvailabilityController } from "./IAvailabilityController";

export class AvailabilityController implements IAvailabilityController {
    async generateSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
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
                new Date(endDate)
            );

            res.json({
                message: `Generated ${count} availability slots`,
                count,
            });
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to generate slots",
            });
        }
    }

    async getAvailableSlots(
        req: AuthRequest | any,
        res: Response
    ): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const doctorId = id as string;
            const { date } = req.query;

            if (!date) {
                res.status(400).json({
                    error: "date query parameter is required",
                });
                return;
            }

            const slots = await availabilityService.getAvailableSlots(
                doctorId,
                new Date(date as string)
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
            res.status(400).json({
                error: error.message || "Failed to get available slots",
            });
        }
    }

    async cleanupPastSlots(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (req.user?.role !== "ADMIN" && req.user?.role !== "DOCTOR") {
                res.status(403).json({ error: "Forbidden" });
                return;
            }

            const count = await availabilityService.cleanupPastSlots();
            res.json({ message: `Cleaned up ${count} past slots`, count });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || "Failed to cleanup slots",
            });
        }
    }
}

export const availabilityController = new AvailabilityController();

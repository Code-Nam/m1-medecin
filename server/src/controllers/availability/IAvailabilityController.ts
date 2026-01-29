import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth-middleware";

export interface IAvailabilityController {
    generateSlots(req: AuthRequest, res: Response): Promise<void>;
    getAvailableSlots(req: AuthRequest | any, res: Response): Promise<void>;
    cleanupPastSlots(req: AuthRequest, res: Response): Promise<void>;
}

import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth-middleware";

export interface IAppointmentController {
    getAppointmentById(req: AuthRequest, res: Response): Promise<void>;
    getAppointmentsByQuery(req: AuthRequest, res: Response): Promise<void>;
    getAppointments(req: AuthRequest, res: Response): Promise<void>;
    createAppointment(req: AuthRequest, res: Response): Promise<void>;
    updateAppointment(req: AuthRequest, res: Response): Promise<void>;
    deleteAppointment(req: AuthRequest, res: Response): Promise<void>;
}

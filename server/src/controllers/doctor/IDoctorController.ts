import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth-middleware";

export interface IDoctorController {
    getDoctor(req: AuthRequest, res: Response): Promise<void>;
    getDoctors(req: AuthRequest, res: Response): Promise<void>;
    getAllDoctors(req: AuthRequest, res: Response): Promise<void>;
    createDoctor(req: any, res: Response): Promise<void>;
    updateDoctor(req: AuthRequest, res: Response): Promise<void>;
    deleteDoctor(req: AuthRequest, res: Response): Promise<void>;
}

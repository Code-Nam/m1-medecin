import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth-middleware";

export interface IPatientController {
    getPatient(req: AuthRequest, res: Response): Promise<void>;
    getPatients(req: AuthRequest, res: Response): Promise<void>;
    createPatient(req: any, res: Response): Promise<void>;
    updatePatient(req: AuthRequest, res: Response): Promise<void>;
    deletePatient(req: AuthRequest, res: Response): Promise<void>;
}

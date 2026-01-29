import type { Request, Response } from "express";

export interface IAuthController {
    loginPatient(req: Request, res: Response): Promise<void>;
    registerPatient(req: Request, res: Response): Promise<void>;
    loginDoctor(req: Request, res: Response): Promise<void>;
    loginSecretary(req: Request, res: Response): Promise<void>;
}

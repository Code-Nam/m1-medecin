import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth-middleware";

export interface ISecretaryController {
    getSecretary(req: AuthRequest, res: Response): Promise<void>;
    getSecretaries(req: AuthRequest, res: Response): Promise<void>;
    createSecretary(req: AuthRequest, res: Response): Promise<void>;
    updateSecretary(req: AuthRequest, res: Response): Promise<void>;
    deleteSecretary(req: AuthRequest, res: Response): Promise<void>;
}

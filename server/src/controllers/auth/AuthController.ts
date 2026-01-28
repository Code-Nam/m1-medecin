import type { Request, Response } from "express";
import { authService } from "../../services/auth/AuthService";
import { loginSchema } from "../../utils/validators";
import { validate } from "../../middlewares/validate-middleware";
import type { IAuthController } from "./IAuthController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";

export class AuthController implements IAuthController {
    async loginPatient(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.LOGIN,
                    `patient email=${email}`,
                ),
            );
            const result = await authService.loginPatient(email, password);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Patient ${email} logged in`,
                ),
            );
            res.json(result);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `patient login: ${error.message}`,
                ),
            );
            res.status(401).json({ error: error.message || "Login failed" });
        }
    }

    async registerPatient(req: Request, res: Response): Promise<void> {
        try {
            const patientData = req.body;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.REGISTER,
                    `patient email=${patientData.email}`,
                ),
            );
            const result = await authService.registerPatient(patientData);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Patient ${patientData.email} registered`,
                ),
            );
            res.status(201).json(result);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `patient registration: ${error.message}`,
                ),
            );
            res.status(400).json({
                error: error.message || "Registration failed",
            });
        }
    }

    async loginDoctor(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.LOGIN,
                    `doctor email=${email}`,
                ),
            );
            const result = await authService.loginDoctor(email, password);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Doctor ${email} logged in`,
                ),
            );
            res.json(result);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `doctor login: ${error.message}`,
                ),
            );
            res.status(401).json({ error: error.message || "Login failed" });
        }
    }

    async loginSecretary(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.LOGIN,
                    `secretary email=${email}`,
                ),
            );
            const result = await authService.loginSecretary(email, password);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Secretary ${email} logged in`,
                ),
            );
            res.json(result);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `secretary login: ${error.message}`,
                ),
            );
            res.status(401).json({ error: error.message || "Login failed" });
        }
    }
}

export const authController = new AuthController();

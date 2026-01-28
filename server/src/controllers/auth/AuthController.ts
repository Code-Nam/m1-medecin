import type { Request, Response } from "express";
import { authService } from "../../services/auth/AuthService";
import type { IAuthController } from "./IAuthController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import { ResponseHandler } from "../../utils/responseHandler";

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
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "patient login");
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
            ResponseHandler.created(res, result);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "patient registration");
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
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "doctor login");
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
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "secretary login");
        }
    }
}

export const authController = new AuthController();

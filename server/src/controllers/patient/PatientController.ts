import type { Response } from "express";
import { patientService } from "../../services/patient/PatientService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IPatientController } from "./IPatientController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import {
    ResponseHandler,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
} from "../../utils/responseHandler";

export class PatientController implements IPatientController {
    async getPatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `patient by id=${id} user=${req.user?.id}`,
                ),
            );
            if (!id) {
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }
            const patient = await patientService.getPatient(id as string);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved patient ${id}`,
                ),
            );
            ResponseHandler.success(res, patient);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "getting patient", req.user?.id);
        }
    }

    async getPatients(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const doctorId = req.query.doctorId as string | undefined;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `patients page=${page} pageSize=${pageSize} doctorId=${doctorId}`,
                ),
            );

            const result = await patientService.getPatients(
                page,
                pageSize,
                doctorId,
            );
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved ${result.patients.length} patients`,
                ),
            );
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "getting patients",
                req.user?.id,
            );
        }
    }

    async createPatient(req: any, res: Response): Promise<void> {
        try {
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.CREATE,
                    `patient email=${req.body.email}`,
                ),
            );
            const patient = await patientService.createPatient(req.body);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Created patient ${patient.id}`,
                ),
            );
            ResponseHandler.created(res, patient);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "creating patient",
                req.user?.id,
            );
        }
    }

    async updatePatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }

            if (req.user?.role === "PATIENT" && req.user.id !== id) {
                return ResponseHandler.forbidden(
                    res,
                    "You can only update your own profile",
                );
            }

            const patient = await patientService.updatePatient(
                id as string,
                req.body,
            );
            ResponseHandler.success(res, patient);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "updating patient",
                req.user?.id,
            );
        }
    }

    async deletePatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }

            if (req.user?.role === "PATIENT" && req.user.id !== id) {
                return ResponseHandler.forbidden(
                    res,
                    "You can only delete your own account",
                );
            }

            await patientService.deletePatient(id as string);
            ResponseHandler.noContent(res);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "deleting patient",
                req.user?.id,
            );
        }
    }
}

export const patientController = new PatientController();

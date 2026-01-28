import type { Response } from "express";
import { patientService } from "../../services/patient/PatientService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IPatientController } from "./IPatientController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";

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
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const patient = await patientService.getPatient(id as string);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved patient ${id}`,
                ),
            );
            res.json(patient);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting patient: ${error.message}`,
                ),
            );
            res.status(404).json({
                error: error.message || "Patient not found",
            });
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
            res.json(result);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting patients: ${error.message}`,
                ),
            );
            res.status(500).json({
                error: error.message || "Failed to fetch patients",
            });
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
            res.status(201).json(patient);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `creating patient: ${error.message}`,
                ),
            );
            res.status(400).json({
                error: error.message || "Failed to create patient",
            });
        }
    }

    async updatePatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }

            if (req.user?.role === "PATIENT" && req.user.id !== id) {
                res.status(403).json({
                    error: "Forbidden: You can only update your own profile",
                });
                return;
            }

            const patient = await patientService.updatePatient(
                id as string,
                req.body,
            );
            res.json(patient);
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to update patient",
            });
        }
    }

    async deletePatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }

            if (req.user?.role === "PATIENT" && req.user.id !== id) {
                res.status(403).json({
                    error: "Forbidden: You can only delete your own account",
                });
                return;
            }

            await patientService.deletePatient(id as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to delete patient",
            });
        }
    }
}

export const patientController = new PatientController();

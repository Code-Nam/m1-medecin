import type { Response } from "express";
import { doctorService } from "../../services/doctor/DoctorService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IDoctorController } from "./IDoctorController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";

export class DoctorController implements IDoctorController {
    async getDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `doctor by id=${id} user=${req.user?.id}`,
                ),
            );
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const doctor = await doctorService.getDoctor(id as string);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved doctor ${id}`,
                ),
            );
            res.json(doctor);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting doctor: ${error.message}`,
                ),
            );
            res.status(404).json({
                error: error.message || "Doctor not found",
            });
        }
    }

    async getDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `doctors page=${page} pageSize=${pageSize}`,
                ),
            );

            const result = await doctorService.getDoctors(page, pageSize);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved ${result.doctors.length} doctors`,
                ),
            );
            res.json(result);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting doctors: ${error.message}`,
                ),
            );
            res.status(500).json({
                error: error.message || "Failed to fetch doctors",
            });
        }
    }

    async getAllDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `all doctors`,
                ),
            );
            const doctors = await doctorService.getAllDoctors();
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved ${doctors.length} doctors`,
                ),
            );
            res.json({ doctors });
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting all doctors: ${error.message}`,
                ),
            );
            res.status(500).json({
                error: error.message || "Failed to fetch doctors",
            });
        }
    }

    async createDoctor(req: any, res: Response): Promise<void> {
        try {
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.CREATE,
                    `doctor email=${req.body.email}`,
                ),
            );
            const doctor = await doctorService.createDoctor(req.body as any);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Created doctor ${doctor.id}`,
                ),
            );
            res.status(201).json({
                message:
                    "Doctor creation request received and is under review.",
                doctor,
            });
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `creating doctor: ${error.message}`,
                ),
            );
            res.status(400).json({
                error: error.message || "Failed to create doctor",
            });
        }
    }

    async updateDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }

            if (req.user?.role === "DOCTOR" && req.user.id !== id) {
                res.status(403).json({
                    error: "Forbidden: You can only update your own profile",
                });
                return;
            }

            const doctor = await doctorService.updateDoctor(
                id as string,
                req.body as any,
            );
            res.json(doctor);
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to update doctor",
            });
        }
    }

    async deleteDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }

            if (req.user?.role === "DOCTOR" && req.user.id !== id) {
                res.status(403).json({
                    error: "Forbidden: You can only delete your own account",
                });
                return;
            }

            await doctorService.deleteDoctor(id as string);
            res.json({
                message:
                    "Doctor deletion request received and is under review.",
            });
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to delete doctor",
            });
        }
    }
}

export const doctorController = new DoctorController();

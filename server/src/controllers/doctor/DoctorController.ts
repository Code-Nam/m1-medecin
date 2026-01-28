import type { Response } from "express";
import { doctorService } from "../../services/doctor/DoctorService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IDoctorController } from "./IDoctorController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import {
    ResponseHandler,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
} from "../../utils/responseHandler";

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
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }
            const doctor = await doctorService.getDoctor(id as string);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved doctor ${id}`,
                ),
            );
            ResponseHandler.success(res, doctor);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "getting doctor", req.user?.id);
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
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "getting doctors", req.user?.id);
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
            ResponseHandler.success(res, { doctors });
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "getting all doctors",
                req.user?.id,
            );
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
            ResponseHandler.created(res, {
                message:
                    "Doctor creation request received and is under review.",
                doctor,
            });
        } catch (error: any) {
            ResponseHandler.handle(error, res, "creating doctor", req.user?.id);
        }
    }

    async updateDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }

            if (req.user?.role === "DOCTOR" && req.user.id !== id) {
                return ResponseHandler.forbidden(
                    res,
                    "You can only update your own profile",
                );
            }

            const doctor = await doctorService.updateDoctor(
                id as string,
                req.body as any,
            );
            ResponseHandler.success(res, doctor);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "updating doctor", req.user?.id);
        }
    }

    async deleteDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }

            if (req.user?.role === "DOCTOR" && req.user.id !== id) {
                return ResponseHandler.forbidden(
                    res,
                    "You can only delete your own account",
                );
            }

            await doctorService.deleteDoctor(id as string);
            ResponseHandler.success(res, {
                message:
                    "Doctor deletion request received and is under review.",
            });
        } catch (error: any) {
            ResponseHandler.handle(error, res, "deleting doctor", req.user?.id);
        }
    }
}

export const doctorController = new DoctorController();

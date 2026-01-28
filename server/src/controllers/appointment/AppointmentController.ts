import type { Response } from "express";
import { appointmentService } from "../../services/appointment/AppointmentService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IAppointmentController } from "./IAppointmentController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import {
    ResponseHandler,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
} from "../../utils/responseHandler";

export class AppointmentController implements IAppointmentController {
    async getAppointmentById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `appointment by id=${appointmentId} user=${req.user?.id} role=${req.user?.role}`,
                ),
            );
            if (!appointmentId) {
                return ResponseHandler.badRequest(
                    res,
                    "appointmentId parameter is required",
                );
            }
            const appointment = await appointmentService.getAppointmentById(
                appointmentId as string,
            );

            if (
                req.user?.role === "PATIENT" &&
                appointment.appointedPatient !== req.user.id
            ) {
                logger.warn(
                    formatLogMessage(
                        LogLayer.CONTROLLER,
                        LogOperation.FORBIDDEN,
                        `Patient ${req.user.id} tried to access appointment ${appointmentId}`,
                    ),
                );
                return ResponseHandler.forbidden(
                    res,
                    "You can only view your own appointments",
                );
            }

            if (
                req.user?.role === "DOCTOR" &&
                appointment.appointedDoctor !== req.user.id
            ) {
                logger.warn(
                    formatLogMessage(
                        LogLayer.CONTROLLER,
                        LogOperation.FORBIDDEN,
                        `Doctor ${req.user.id} tried to access appointment ${appointmentId}`,
                    ),
                );
                return ResponseHandler.forbidden(
                    res,
                    "You can only view your own appointments",
                );
            }

            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved appointment ${appointmentId}`,
                ),
            );
            ResponseHandler.success(res, appointment);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "getting appointment",
                req.user?.id,
            );
        }
    }

    async getAppointmentsByQuery(
        req: AuthRequest,
        res: Response,
    ): Promise<void> {
        try {
            const { patientId, doctorId } = req.query;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            if (patientId) {
                if (req.user?.role === "PATIENT" && req.user.id === patientId) {
                    const result =
                        await appointmentService.getAppointmentsByPatient(
                            patientId as string,
                            page,
                            pageSize,
                        );
                    ResponseHandler.success(res, result);
                    return;
                }

                if (
                    req.user?.role === "DOCTOR" ||
                    req.user?.role === "SECRETARY"
                ) {
                    const result =
                        await appointmentService.getAppointmentsByPatient(
                            patientId as string,
                            page,
                            pageSize,
                        );
                    ResponseHandler.success(res, result);
                    return;
                }

                return ResponseHandler.forbidden(
                    res,
                    "You can only view your own appointments",
                );
            }

            if (doctorId) {
                if (req.user?.role === "DOCTOR" && req.user.id === doctorId) {
                    const result =
                        await appointmentService.getAppointmentsByDoctor(
                            doctorId as string,
                            page,
                            pageSize,
                        );
                    ResponseHandler.success(res, result);
                    return;
                }

                if (req.user?.role === "SECRETARY") {
                    const result =
                        await appointmentService.getAppointmentsByDoctor(
                            doctorId as string,
                            page,
                            pageSize,
                        );
                    ResponseHandler.success(res, result);
                    return;
                }

                return ResponseHandler.forbidden(
                    res,
                    "You can only view your own appointments",
                );
            }

            return ResponseHandler.badRequest(
                res,
                "Missing patientId or doctorId parameter",
            );
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "fetching appointments",
                req.user?.id,
            );
        }
    }

    async getAppointments(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            if (req.user?.role === "PATIENT" && req.user.id === id) {
                const result =
                    await appointmentService.getAppointmentsByPatient(
                        id as string,
                        page,
                        pageSize,
                    );
                ResponseHandler.success(res, result);
                return;
            }

            if (req.user?.role === "DOCTOR" && req.user.id === id) {
                const result = await appointmentService.getAppointmentsByDoctor(
                    id as string,
                    page,
                    pageSize,
                );
                ResponseHandler.success(res, result);
                return;
            }

            if (req.user?.role === "SECRETARY") {
                const result = await appointmentService.getAppointmentsByDoctor(
                    id as string,
                    page,
                    pageSize,
                );
                ResponseHandler.success(res, result);
                return;
            }

            return ResponseHandler.forbidden(
                res,
                "You can only view your own appointments",
            );
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "fetching appointments",
                req.user?.id,
            );
        }
    }

    async createAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const appointment = await appointmentService.createAppointment(
                req.body,
            );
            ResponseHandler.created(res, appointment);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "creating appointment",
                req.user?.id,
            );
        }
    }

    async updateAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            if (!appointmentId) {
                return ResponseHandler.badRequest(
                    res,
                    "appointmentId parameter is required",
                );
            }

            if (req.user?.role !== "DOCTOR" && req.user?.role !== "SECRETARY") {
                return ResponseHandler.forbidden(
                    res,
                    "Only doctors and secretaries can update appointments",
                );
            }

            const appointment = await appointmentService.updateAppointment(
                appointmentId as string,
                req.body,
            );
            ResponseHandler.success(res, appointment);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "updating appointment",
                req.user?.id,
            );
        }
    }

    async deleteAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            if (!appointmentId) {
                return ResponseHandler.badRequest(
                    res,
                    "appointmentId parameter is required",
                );
            }

            await appointmentService.deleteAppointment(appointmentId as string);
            ResponseHandler.noContent(res);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "deleting appointment",
                req.user?.id,
            );
        }
    }
}

export const appointmentController = new AppointmentController();

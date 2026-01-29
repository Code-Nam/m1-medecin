import type { Response } from "express";
import { appointmentService } from "../../services/appointment/AppointmentService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IAppointmentController } from "./IAppointmentController";
import { LogOperation } from "../../errors";
import { ResponseHandler } from "../../utils/responseHandler";
import {
    validateRequiredParam,
    getPaginationParams,
    checkAppointmentAccess,
    checkRoles,
    logOperationWithRequest,
    logSuccess,
} from "../helpers";

export class AppointmentController implements IAppointmentController {
    async getAppointmentById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            logOperationWithRequest(
                req,
                LogOperation.GET,
                `appointment by id=${appointmentId}`,
            );

            if (!validateRequiredParam(res, "appointmentId", appointmentId))
                return;

            const appointment = await appointmentService.getAppointmentById(
                appointmentId as string,
            );

            if (!checkAppointmentAccess(req, res, appointment)) return;

            logSuccess(`Retrieved appointment ${appointmentId}`, req.user?.id);
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
            const { page, pageSize } = getPaginationParams(req.query);

            if (patientId) {
                if (req.user?.role === "PATIENT" && req.user.id === patientId) {
                    const result =
                        await appointmentService.getAppointmentsByPatient(
                            patientId as string,
                            page,
                            pageSize,
                        );
                    return ResponseHandler.success(res, result);
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
                    return ResponseHandler.success(res, result);
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
                    return ResponseHandler.success(res, result);
                }

                if (req.user?.role === "SECRETARY") {
                    const result =
                        await appointmentService.getAppointmentsByDoctor(
                            doctorId as string,
                            page,
                            pageSize,
                        );
                    return ResponseHandler.success(res, result);
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
            const { page, pageSize } = getPaginationParams(req.query);

            if (req.user?.role === "PATIENT" && req.user.id === id) {
                const result =
                    await appointmentService.getAppointmentsByPatient(
                        id as string,
                        page,
                        pageSize,
                    );
                return ResponseHandler.success(res, result);
            }

            if (req.user?.role === "DOCTOR" && req.user.id === id) {
                const result = await appointmentService.getAppointmentsByDoctor(
                    id as string,
                    page,
                    pageSize,
                );
                return ResponseHandler.success(res, result);
            }

            if (req.user?.role === "SECRETARY") {
                const result = await appointmentService.getAppointmentsByDoctor(
                    id as string,
                    page,
                    pageSize,
                );
                return ResponseHandler.success(res, result);
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
            logOperationWithRequest(req, LogOperation.CREATE, "appointment");
            const appointment = await appointmentService.createAppointment(
                req.body,
            );
            logSuccess(`Created appointment ${appointment.id}`, req.user?.id);
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
            if (!validateRequiredParam(res, "appointmentId", appointmentId))
                return;

            if (
                !checkRoles(
                    req,
                    res,
                    ["DOCTOR", "SECRETARY"],
                    "Only doctors and secretaries can update appointments",
                )
            )
                return;

            const appointment = await appointmentService.updateAppointment(
                appointmentId as string,
                req.body,
            );
            logSuccess(`Updated appointment ${appointmentId}`, req.user?.id);
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
            if (!validateRequiredParam(res, "appointmentId", appointmentId))
                return;

            await appointmentService.deleteAppointment(appointmentId as string);
            logSuccess(`Deleted appointment ${appointmentId}`, req.user?.id);
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

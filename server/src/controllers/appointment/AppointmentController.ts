import type { Response } from "express";
import { appointmentService } from "../../services/appointment/AppointmentService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IAppointmentController } from "./IAppointmentController";

export class AppointmentController implements IAppointmentController {
    async getAppointmentById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            if (!appointmentId) {
                res.status(400).json({
                    error: "appointmentId parameter is required",
                });
                return;
            }
            const appointment = await appointmentService.getAppointmentById(
                appointmentId as string
            );

            if (
                req.user?.role === "PATIENT" &&
                appointment.appointedPatient !== req.user.id
            ) {
                res.status(403).json({
                    error: "Forbidden: You can only view your own appointments",
                });
                return;
            }

            if (
                req.user?.role === "DOCTOR" &&
                appointment.appointedDoctor !== req.user.id
            ) {
                res.status(403).json({ error: "Forbidden" });
                return;
            }

            res.json(appointment);
        } catch (error: any) {
            res.status(404).json({
                error: error.message || "Appointment not found",
            });
        }
    }

    async getAppointmentsByQuery(
        req: AuthRequest,
        res: Response
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
                            pageSize
                        );
                    res.json(result);
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
                            pageSize
                        );
                    res.json(result);
                    return;
                }

                res.status(403).json({
                    error: "Forbidden: You can only view your own appointments",
                });
                return;
            }

            if (doctorId) {
                if (req.user?.role === "DOCTOR" && req.user.id === doctorId) {
                    const result =
                        await appointmentService.getAppointmentsByDoctor(
                            doctorId as string,
                            page,
                            pageSize
                        );
                    res.json(result);
                    return;
                }

                if (req.user?.role === "SECRETARY") {
                    const result =
                        await appointmentService.getAppointmentsByDoctor(
                            doctorId as string,
                            page,
                            pageSize
                        );
                    res.json(result);
                    return;
                }

                res.status(403).json({ error: "Forbidden" });
                return;
            }

            res.status(400).json({
                error: "Missing patientId or doctorId parameter",
            });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || "Failed to fetch appointments",
            });
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
                        pageSize
                    );
                res.json(result);
                return;
            }

            if (req.user?.role === "DOCTOR" && req.user.id === id) {
                const result = await appointmentService.getAppointmentsByDoctor(
                    id as string,
                    page,
                    pageSize
                );
                res.json(result);
                return;
            }

            if (req.user?.role === "SECRETARY") {
                const result = await appointmentService.getAppointmentsByDoctor(
                    id as string,
                    page,
                    pageSize
                );
                res.json(result);
                return;
            }

            res.status(403).json({ error: "Forbidden" });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || "Failed to fetch appointments",
            });
        }
    }

    async createAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const appointment = await appointmentService.createAppointment(
                req.body
            );
            res.status(201).json(appointment);
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to create appointment",
            });
        }
    }

    async updateAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            if (!appointmentId) {
                res.status(400).json({
                    error: "appointmentId parameter is required",
                });
                return;
            }

            if (req.user?.role !== "DOCTOR" && req.user?.role !== "SECRETARY") {
                res.status(403).json({
                    error: "Forbidden: Only doctors and secretaries can update appointments",
                });
                return;
            }

            const appointment = await appointmentService.updateAppointment(
                appointmentId as string,
                req.body
            );
            res.json(appointment);
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to update appointment",
            });
        }
    }

    async deleteAppointment(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { appointmentId } = req.params;
            if (!appointmentId) {
                res.status(400).json({
                    error: "appointmentId parameter is required",
                });
                return;
            }

            await appointmentService.deleteAppointment(appointmentId as string);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to delete appointment",
            });
        }
    }
}

export const appointmentController = new AppointmentController();

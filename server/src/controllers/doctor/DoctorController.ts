import type { Response } from "express";
import { doctorService } from "../../services/doctor/DoctorService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IDoctorController } from "./IDoctorController";

export class DoctorController implements IDoctorController {
    async getDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const doctor = await doctorService.getDoctor(id as string);
            res.json(doctor);
        } catch (error: any) {
            res.status(404).json({
                error: error.message || "Doctor not found",
            });
        }
    }

    async getDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            const result = await doctorService.getDoctors(page, pageSize);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({
                error: error.message || "Failed to fetch doctors",
            });
        }
    }

    async getAllDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            const doctors = await doctorService.getAllDoctors();
            res.json({ doctors });
        } catch (error: any) {
            res.status(500).json({
                error: error.message || "Failed to fetch doctors",
            });
        }
    }

    async createDoctor(req: any, res: Response): Promise<void> {
        try {
            const doctor = await doctorService.createDoctor(req.body as any);
            res.status(201).json({
                message:
                    "Doctor creation request received and is under review.",
                doctor,
            });
        } catch (error: any) {
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
                req.body as any
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

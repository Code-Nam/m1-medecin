import type { Response } from "express";
import { secretaryService } from "../../services/secretary/SecretaryService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { ISecretaryController } from "./ISecretaryController";

export class SecretaryController implements ISecretaryController {
    async getSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const secretaryId = id as string;

            if (
                req.user?.role === "SECRETARY" &&
                (req.user as any).secretaryId !== secretaryId
            ) {
                res.status(403).json({
                    error: "Forbidden: You can only view your own profile",
                });
                return;
            }

            const secretary = await secretaryService.getSecretary(secretaryId);
            res.json(secretary);
        } catch (error: any) {
            res.status(404).json({
                error: error.message || "Secretary not found",
            });
        }
    }

    async getSecretaries(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (req.user?.role !== "ADMIN" && req.user?.role !== "SECRETARY") {
                res.status(403).json({ error: "Forbidden" });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            const result = await secretaryService.getSecretaries(
                page,
                pageSize
            );
            res.json(result);
        } catch (error: any) {
            res.status(500).json({
                error: error.message || "Failed to fetch secretaries",
            });
        }
    }

    async createSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (req.user?.role !== "ADMIN") {
                res.status(403).json({
                    error: "Forbidden: Only admins can create secretaries",
                });
                return;
            }

            const secretary = await secretaryService.createSecretary(req.body);
            res.status(201).json(secretary);
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to create secretary",
            });
        }
    }

    async updateSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const secretaryId = id as string;

            if (
                req.user?.role === "SECRETARY" &&
                (req.user as any).secretaryId !== secretaryId
            ) {
                res.status(403).json({
                    error: "Forbidden: You can only update your own profile",
                });
                return;
            }

            const secretary = await secretaryService.updateSecretary(
                secretaryId,
                req.body
            );
            res.json(secretary);
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to update secretary",
            });
        }
    }

    async deleteSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            if (req.user?.role !== "ADMIN") {
                res.status(403).json({
                    error: "Forbidden: Only admins can delete secretaries",
                });
                return;
            }

            const secretaryId = id as string;
            await secretaryService.deleteSecretary(secretaryId);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({
                error: error.message || "Failed to delete secretary",
            });
        }
    }

    async getSecretariesByDoctor(
        req: AuthRequest,
        res: Response
    ): Promise<void> {
        try {
            const { doctorId } = req.query;
            const doctorIdStr = doctorId as string;
            const secretaries = await secretaryService.getSecretariesByDoctor(
                doctorIdStr
            );
            res.json(secretaries);
        } catch (error: any) {
            res.status(404).json({
                error: error.message || "Doctor not found",
            });
        }
    }
}

export const secretaryController = new SecretaryController();

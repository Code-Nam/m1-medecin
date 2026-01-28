import type { Response } from "express";
import { secretaryService } from "../../services/secretary/SecretaryService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { ISecretaryController } from "./ISecretaryController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";

export class SecretaryController implements ISecretaryController {
    async getSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `secretary by id=${id} user=${req.user?.id}`,
                ),
            );
            if (!id) {
                res.status(400).json({ error: "id parameter is required" });
                return;
            }
            const secretaryId = id as string;

            if (
                req.user?.role === "SECRETARY" &&
                (req.user as any).secretaryId !== secretaryId
            ) {
                logger.warn(
                    formatLogMessage(
                        LogLayer.CONTROLLER,
                        LogOperation.FORBIDDEN,
                        `Secretary ${req.user.id} tried to access secretary ${secretaryId}`,
                    ),
                );
                res.status(403).json({
                    error: "Forbidden: You can only view your own profile",
                });
                return;
            }

            const secretary = await secretaryService.getSecretary(secretaryId);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved secretary ${secretaryId}`,
                ),
            );
            res.json(secretary);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting secretary: ${error.message}`,
                ),
            );
            res.status(404).json({
                error: error.message || "Secretary not found",
            });
        }
    }

    async getSecretaries(req: AuthRequest, res: Response): Promise<void> {
        try {
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.GET,
                    `secretaries user=${req.user?.id} role=${req.user?.role}`,
                ),
            );
            if (req.user?.role !== "ADMIN" && req.user?.role !== "SECRETARY") {
                logger.warn(
                    formatLogMessage(
                        LogLayer.CONTROLLER,
                        LogOperation.FORBIDDEN,
                        `User ${req.user?.id} with role ${req.user?.role} tried to access secretaries`,
                    ),
                );
                res.status(403).json({ error: "Forbidden" });
                return;
            }

            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;

            const result = await secretaryService.getSecretaries(
                page,
                pageSize,
            );
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved ${result.secretaries.length} secretaries`,
                ),
            );
            res.json(result);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `getting secretaries: ${error.message}`,
                ),
            );
            res.status(500).json({
                error: error.message || "Failed to fetch secretaries",
            });
        }
    }

    async createSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.CREATE,
                    `secretary user=${req.user?.id} email=${req.body.email}`,
                ),
            );
            if (req.user?.role !== "ADMIN") {
                logger.warn(
                    formatLogMessage(
                        LogLayer.CONTROLLER,
                        LogOperation.FORBIDDEN,
                        `User ${req.user?.id} with role ${req.user?.role} tried to create secretary`,
                    ),
                );
                res.status(403).json({
                    error: "Forbidden: Only admins can create secretaries",
                });
                return;
            }

            const secretary = await secretaryService.createSecretary(req.body);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Created secretary ${secretary.id}`,
                ),
            );
            res.status(201).json(secretary);
        } catch (error: any) {
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `creating secretary: ${error.message}`,
                ),
            );
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
                req.body,
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
}

export const secretaryController = new SecretaryController();

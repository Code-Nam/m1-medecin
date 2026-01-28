import type { Response } from "express";
import { secretaryService } from "../../services/secretary/SecretaryService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { ISecretaryController } from "./ISecretaryController";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import {
    ResponseHandler,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
} from "../../utils/responseHandler";

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
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
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
                return ResponseHandler.forbidden(
                    res,
                    "You can only view your own profile",
                );
            }

            const secretary = await secretaryService.getSecretary(secretaryId);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Retrieved secretary ${secretaryId}`,
                ),
            );
            ResponseHandler.success(res, secretary);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "getting secretary",
                req.user?.id,
            );
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
                return ResponseHandler.forbidden(
                    res,
                    "Only admins and secretaries can view secretaries",
                );
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
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "getting secretaries",
                req.user?.id,
            );
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
                return ResponseHandler.forbidden(
                    res,
                    "Only admins can create secretaries",
                );
            }

            const secretary = await secretaryService.createSecretary(req.body);
            logger.info(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.SUCCESS,
                    `Created secretary ${secretary.id}`,
                ),
            );
            ResponseHandler.created(res, secretary);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "creating secretary",
                req.user?.id,
            );
        }
    }

    async updateSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }
            const secretaryId = id as string;

            if (
                req.user?.role === "SECRETARY" &&
                (req.user as any).secretaryId !== secretaryId
            ) {
                return ResponseHandler.forbidden(
                    res,
                    "You can only update your own profile",
                );
            }

            const secretary = await secretaryService.updateSecretary(
                secretaryId,
                req.body,
            );
            ResponseHandler.success(res, secretary);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "updating secretary",
                req.user?.id,
            );
        }
    }

    async deleteSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.badRequest(
                    res,
                    "id parameter is required",
                );
            }
            if (req.user?.role !== "ADMIN") {
                return ResponseHandler.forbidden(
                    res,
                    "Only admins can delete secretaries",
                );
            }

            const secretaryId = id as string;
            await secretaryService.deleteSecretary(secretaryId);
            ResponseHandler.noContent(res);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "deleting secretary",
                req.user?.id,
            );
        }
    }
}

export const secretaryController = new SecretaryController();

import type { Response } from "express";
import { secretaryService } from "../../services/secretary/SecretaryService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { ISecretaryController } from "./ISecretaryController";
import { ResponseHandler } from "../../utils/responseHandler";
import {
    validateRequiredParam,
    getPaginationParams,
    checkRoles,
    logOperation,
    logSuccess,
} from "../helpers";
import { LogOperation } from "../../errors";

export class SecretaryController implements ISecretaryController {
    async getSecretary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logOperation(
                LogOperation.GET,
                `secretary by id=${id}`,
                req.user?.id,
            );
            if (!validateRequiredParam(res, "id", id)) return;

            const secretaryId = id as string;

            // Check secretary-specific ownership (using secretaryId from user)
            if (
                req.user?.role === "SECRETARY" &&
                (req.user as any).secretaryId !== secretaryId
            ) {
                logOperation(
                    LogOperation.FORBIDDEN,
                    `Secretary ${req.user.id} tried to access secretary ${secretaryId}`,
                );
                return ResponseHandler.forbidden(
                    res,
                    "You can only view your own profile",
                );
            }

            const secretary = await secretaryService.getSecretary(secretaryId);
            logSuccess(`Retrieved secretary ${secretaryId}`);
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
            logOperation(
                LogOperation.GET,
                `secretaries role=${req.user?.role}`,
                req.user?.id,
            );
            if (
                !checkRoles(
                    req,
                    res,
                    ["ADMIN", "SECRETARY"],
                    "Only admins and secretaries can view secretaries",
                )
            )
                return;

            const { page, pageSize } = getPaginationParams(req.query);

            const result = await secretaryService.getSecretaries(
                page,
                pageSize,
            );
            logSuccess(`Retrieved ${result.secretaries.length} secretaries`);
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
            logOperation(
                LogOperation.CREATE,
                `secretary email=${req.body.email}`,
                req.user?.id,
            );
            if (
                !checkRoles(
                    req,
                    res,
                    ["ADMIN"],
                    "Only admins can create secretaries",
                )
            )
                return;

            const secretary = await secretaryService.createSecretary(req.body);
            logSuccess(`Created secretary ${secretary.id}`);
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
            if (!validateRequiredParam(res, "id", id)) return;

            const secretaryId = id as string;

            // Check secretary-specific ownership (using secretaryId from user)
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
            if (!validateRequiredParam(res, "id", id)) return;
            if (
                !checkRoles(
                    req,
                    res,
                    ["ADMIN"],
                    "Only admins can delete secretaries",
                )
            )
                return;

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

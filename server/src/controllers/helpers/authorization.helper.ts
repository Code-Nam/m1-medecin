import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import { ResponseHandler } from "../../utils/responseHandler";
import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";

/**
 * Checks if user can only access their own resource
 * Returns true if authorized, false if forbidden (response already sent)
 */
export function checkOwnership(
    req: AuthRequest,
    res: Response,
    resourceId: string,
    resourceType: "patient" | "doctor" | "secretary",
): boolean {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    // Allow different role types to map correctly
    const roleMatches =
        (userRole === "PATIENT" && resourceType === "patient") ||
        (userRole === "DOCTOR" && resourceType === "doctor") ||
        (userRole === "SECRETARY" && resourceType === "secretary");

    if (roleMatches && userId !== resourceId) {
        logger.warn(
            formatLogMessage(
                LogLayer.CONTROLLER,
                LogOperation.FORBIDDEN,
                `${userRole} ${userId} tried to access ${resourceType} ${resourceId}`,
            ),
        );
        ResponseHandler.forbidden(
            res,
            `You can only access your own ${resourceType} profile`,
        );
        return false;
    }

    return true;
}

/**
 * Checks if user has one of the required roles
 * Returns true if authorized, false if forbidden (response already sent)
 */
export function checkRoles(
    req: AuthRequest,
    res: Response,
    allowedRoles: string[],
    errorMessage?: string,
): boolean {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
        logger.warn(
            formatLogMessage(
                LogLayer.CONTROLLER,
                LogOperation.FORBIDDEN,
                `User ${req.user?.id} with role ${userRole} tried unauthorized access`,
            ),
        );
        ResponseHandler.forbidden(
            res,
            errorMessage || "You do not have permission to perform this action",
        );
        return false;
    }

    return true;
}

/**
 * Checks if user can access appointment based on their role
 */
export function checkAppointmentAccess(
    req: AuthRequest,
    res: Response,
    appointment: { appointedPatient: string; appointedDoctor: string },
): boolean {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (userRole === "PATIENT" && appointment.appointedPatient !== userId) {
        logger.warn(
            formatLogMessage(
                LogLayer.CONTROLLER,
                LogOperation.FORBIDDEN,
                `Patient ${userId} tried to access appointment`,
            ),
        );
        ResponseHandler.forbidden(
            res,
            "You can only view your own appointments",
        );
        return false;
    }

    if (userRole === "DOCTOR" && appointment.appointedDoctor !== userId) {
        logger.warn(
            formatLogMessage(
                LogLayer.CONTROLLER,
                LogOperation.FORBIDDEN,
                `Doctor ${userId} tried to access appointment`,
            ),
        );
        ResponseHandler.forbidden(
            res,
            "You can only view your own appointments",
        );
        return false;
    }

    return true;
}

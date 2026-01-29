import { logger } from "../../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../../errors";
import type { AuthRequest } from "../../middlewares/auth-middleware";

/**
 * Logs controller operation start
 */
export function logOperation(
    operation: LogOperation,
    message: string,
    userId?: string,
): void {
    const userInfo = userId ? ` user=${userId}` : "";
    logger.info(
        formatLogMessage(
            LogLayer.CONTROLLER,
            operation,
            `${message}${userInfo}`,
        ),
    );
}

/**
 * Logs successful controller operation
 */
export function logSuccess(message: string, userId?: string): void {
    logOperation(LogOperation.SUCCESS, message, userId);
}

/**
 * Logs controller operation with request context
 */
export function logOperationWithRequest(
    req: AuthRequest,
    operation: LogOperation,
    message: string,
): void {
    const userInfo = req.user?.id ? ` user=${req.user.id}` : "";
    const roleInfo = req.user?.role ? ` role=${req.user.role}` : "";
    logger.info(
        formatLogMessage(
            LogLayer.CONTROLLER,
            operation,
            `${message}${userInfo}${roleInfo}`,
        ),
    );
}

import type { Response } from "express";
import { logger } from "../config/logger";
import { LogLayer, LogOperation, formatLogMessage } from "../errors";

/**
 * Custom application error class with HTTP status code
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational: boolean = true,
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Predefined error types for common HTTP errors
 */
export class BadRequestError extends AppError {
    constructor(message: string = "Bad Request") {
        super(400, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized") {
        super(401, message);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden") {
        super(403, message);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Not Found") {
        super(404, message);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = "Conflict") {
        super(409, message);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = "Internal Server Error") {
        super(500, message, false);
    }
}

/**
 * Response handler helper for controllers
 * Handles both successful responses and errors in a consistent way
 */
export class ResponseHandler {
    /**
     * Handles errors and sends appropriate HTTP response
     * @param error - The error object
     * @param res - Express response object
     * @param context - Context information for logging (e.g., "getting appointment")
     * @param userId - Optional user ID for logging
     */
    static handle(
        error: any,
        res: Response,
        context: string,
        userId?: string,
    ): void {
        const userInfo = userId ? ` user=${userId}` : "";

        if (error instanceof AppError) {
            // Known operational errors
            logger.warn(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    this.getLogOperation(error.statusCode),
                    `${context}: ${error.message}${userInfo}`,
                ),
            );

            res.status(error.statusCode).json({
                error: error.message,
            });
        } else {
            // Unknown errors (programming errors or unexpected issues)
            logger.error(
                formatLogMessage(
                    LogLayer.CONTROLLER,
                    LogOperation.ERROR,
                    `${context}: ${error.message || "Unknown error"}${userInfo}`,
                ),
            );

            // Don't leak error details in production
            const message =
                process.env.NODE_ENV === "development"
                    ? error.message || "Internal Server Error"
                    : "Internal Server Error";

            res.status(500).json({
                error: message,
            });
        }
    }

    /**
     * Determines the appropriate log operation based on status code
     */
    private static getLogOperation(statusCode: number): LogOperation {
        switch (statusCode) {
            case 400:
                return LogOperation.ERROR;
            case 401:
                return LogOperation.ERROR;
            case 403:
                return LogOperation.FORBIDDEN;
            case 404:
                return LogOperation.NOT_FOUND;
            case 409:
                return LogOperation.ERROR;
            default:
                return LogOperation.ERROR;
        }
    }

    /**
     * Sends a success response with data
     */
    static success<T>(res: Response, data: T, statusCode: number = 200): void {
        res.status(statusCode).json(data);
    }

    /**
     * Sends a created response (201)
     */
    static created<T>(res: Response, data: T): void {
        res.status(201).json(data);
    }

    /**
     * Sends a no content response (204)
     */
    static noContent(res: Response): void {
        res.status(204).send();
    }

    /**
     * Sends a bad request error response (400)
     */
    static badRequest(res: Response, message: string = "Bad Request"): void {
        res.status(400).json({ error: message });
    }

    /**
     * Sends an unauthorized error response (401)
     */
    static unauthorized(res: Response, message: string = "Unauthorized"): void {
        res.status(401).json({ error: message });
    }

    /**
     * Sends a forbidden error response (403)
     */
    static forbidden(res: Response, message: string = "Forbidden"): void {
        res.status(403).json({ error: message });
    }

    /**
     * Sends a not found error response (404)
     */
    static notFound(res: Response, message: string = "Not Found"): void {
        res.status(404).json({ error: message });
    }

    /**
     * Sends a conflict error response (409)
     */
    static conflict(res: Response, message: string = "Conflict"): void {
        res.status(409).json({ error: message });
    }

    /**
     * Sends an internal server error response (500)
     */
    static internalError(
        res: Response,
        message: string = "Internal Server Error",
    ): void {
        res.status(500).json({ error: message });
    }
}

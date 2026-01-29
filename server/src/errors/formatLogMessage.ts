import { LogLayer } from "./LogLayer";
import { LogOperation } from "./LogOperation";

/**
 * Sanitizes sensitive information (like IDs) from log messages in production
 * @param message - The log message to sanitize
 * @returns Sanitized message with IDs masked in production
 */
function sanitizeMessage(message: string): string {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
        return message;
    }

    // In production, mask IDs for security
    // Patterns to match:
    // - id=<value>
    // - <entity>Id=<value>
    // - by id=<value>
    return message
        .replace(/\bid=[\w-]+/gi, "id=***")
        .replace(/\b(\w+)Id=[\w-]+/gi, "$1Id=***")
        .replace(/\bby id=[\w-]+/gi, "by id=***");
}

/**
 * Formats a log message with consistent structure
 * @param layer - The application layer where the log is generated
 * @param operation - The operation being performed
 * @param details - Optional additional details about the operation
 * @returns Formatted log message string
 */
export function formatLogMessage(
    layer: LogLayer,
    operation: LogOperation,
    details?: string,
): string {
    const baseMessage = `[${layer}] ${operation}`;

    if (!details) {
        return baseMessage;
    }

    const sanitizedDetails = sanitizeMessage(details);
    return `${baseMessage} ${sanitizedDetails}`;
}

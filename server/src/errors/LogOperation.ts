/**
 * Enum representing different operations for logging purposes
 */
export enum LogOperation {
    // Read operations
    FIND = "FIND",
    FOUND = "FOUND",
    NOT_FOUND = "NOT_FOUND",
    GET = "GET",
    COUNT = "COUNT",

    // Write operations
    CREATE = "CREATE",
    CREATED = "CREATED",
    UPDATE = "UPDATE",
    UPDATED = "UPDATED",
    DELETE = "DELETE",
    DELETED = "DELETED",
    REMOVE = "REMOVE",
    REMOVED = "REMOVED",

    // Generation operations
    GENERATE = "GENERATE",
    GENERATED = "GENERATED",

    // Maintenance operations
    CLEANUP = "CLEANUP",

    // Authentication operations
    LOGIN = "LOGIN",
    REGISTER = "REGISTER",

    // Status operations
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    FORBIDDEN = "FORBIDDEN",
}

import type { Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";

/**
 * Validates that required parameters are present
 * Returns true if validation passes, false if it fails (response already sent)
 */
export function validateRequiredParam(
    res: Response,
    paramName: string,
    paramValue: any,
): boolean {
    if (!paramValue) {
        ResponseHandler.badRequest(res, `${paramName} parameter is required`);
        return false;
    }
    return true;
}

/**
 * Validates multiple required parameters at once
 */
export function validateRequiredParams(
    res: Response,
    params: Array<{ name: string; value: any }>,
): boolean {
    for (const param of params) {
        if (!param.value) {
            ResponseHandler.badRequest(
                res,
                `${param.name} parameter is required`,
            );
            return false;
        }
    }
    return true;
}

/**
 * Validates pagination parameters and returns parsed values
 */
export function getPaginationParams(query: any): {
    page: number;
    pageSize: number;
} {
    return {
        page: parseInt(query.page as string) || 1,
        pageSize: parseInt(query.pageSize as string) || 10,
    };
}

import type { Response } from "express";
import { doctorService } from "../../services/doctor/DoctorService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IDoctorController } from "./IDoctorController";
import { LogOperation } from "../../errors";
import { ResponseHandler } from "../../utils/responseHandler";
import {
    validateRequiredParam,
    getPaginationParams,
    checkOwnership,
    logOperationWithRequest,
    logSuccess,
    logOperation,
} from "../helpers";

export class DoctorController implements IDoctorController {
    async getDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logOperationWithRequest(
                req,
                LogOperation.GET,
                `doctor by id=${id}`,
            );

            if (!validateRequiredParam(res, "id", id)) return;

            const doctor = await doctorService.getDoctor(id as string);
            logSuccess(`Retrieved doctor ${id}`, req.user?.id);
            ResponseHandler.success(res, doctor);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "getting doctor", req.user?.id);
        }
    }

    async getDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { page, pageSize } = getPaginationParams(req.query);
            logOperation(
                LogOperation.GET,
                `doctors page=${page} pageSize=${pageSize}`,
            );

            const result = await doctorService.getDoctors(page, pageSize);
            logSuccess(`Retrieved ${result.doctors.length} doctors`);
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "getting doctors", req.user?.id);
        }
    }

    async getAllDoctors(req: AuthRequest, res: Response): Promise<void> {
        try {
            logOperation(LogOperation.GET, "all doctors");
            const doctors = await doctorService.getAllDoctors();
            logSuccess(`Retrieved ${doctors.length} doctors`);
            ResponseHandler.success(res, { doctors });
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "getting all doctors",
                req.user?.id,
            );
        }
    }

    async createDoctor(req: any, res: Response): Promise<void> {
        try {
            logOperation(LogOperation.CREATE, `doctor email=${req.body.email}`);
            const doctor = await doctorService.createDoctor(req.body as any);
            logSuccess(`Created doctor ${doctor.id}`);
            ResponseHandler.created(res, {
                message:
                    "Doctor creation request received and is under review.",
                doctor,
            });
        } catch (error: any) {
            ResponseHandler.handle(error, res, "creating doctor", req.user?.id);
        }
    }

    async updateDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!validateRequiredParam(res, "id", id)) return;

            if (!checkOwnership(req, res, id as string, "doctor")) return;

            const doctor = await doctorService.updateDoctor(
                id as string,
                req.body as any,
            );
            logSuccess(`Updated doctor ${id}`, req.user?.id);
            ResponseHandler.success(res, doctor);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "updating doctor", req.user?.id);
        }
    }

    async deleteDoctor(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!validateRequiredParam(res, "id", id)) return;

            if (!checkOwnership(req, res, id as string, "doctor")) return;

            await doctorService.deleteDoctor(id as string);
            logSuccess(`Deleted doctor ${id}`, req.user?.id);
            ResponseHandler.success(res, {
                message:
                    "Doctor deletion request received and is under review.",
            });
        } catch (error: any) {
            ResponseHandler.handle(error, res, "deleting doctor", req.user?.id);
        }
    }
}

export const doctorController = new DoctorController();

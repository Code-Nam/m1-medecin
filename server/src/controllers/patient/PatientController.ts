import type { Response } from "express";
import { patientService } from "../../services/patient/PatientService";
import type { AuthRequest } from "../../middlewares/auth-middleware";
import type { IPatientController } from "./IPatientController";
import { ResponseHandler } from "../../utils/responseHandler";
import {
    validateRequiredParam,
    getPaginationParams,
    checkOwnership,
    logOperation,
    logSuccess,
} from "../helpers";
import { LogOperation } from "../../errors";

export class PatientController implements IPatientController {
    async getPatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            logOperation(LogOperation.GET, `patient by id=${id}`, req.user?.id);
            if (!validateRequiredParam(res, "id", id)) return;

            const patient = await patientService.getPatient(id as string);
            logSuccess(`Retrieved patient ${id}`);
            ResponseHandler.success(res, patient);
        } catch (error: any) {
            ResponseHandler.handle(error, res, "getting patient", req.user?.id);
        }
    }

    async getPatients(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { page, pageSize } = getPaginationParams(req.query);
            const doctorId = req.query.doctorId as string | undefined;
            logOperation(
                LogOperation.GET,
                `patients page=${page} pageSize=${pageSize} doctorId=${doctorId}`,
            );

            const result = await patientService.getPatients(
                page,
                pageSize,
                doctorId,
            );
            logSuccess(`Retrieved ${result.patients.length} patients`);
            ResponseHandler.success(res, result);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "getting patients",
                req.user?.id,
            );
        }
    }

    async createPatient(req: any, res: Response): Promise<void> {
        try {
            logOperation(
                LogOperation.CREATE,
                `patient email=${req.body.email}`,
            );
            const patient = await patientService.createPatient(req.body);
            logSuccess(`Created patient ${patient.id}`);
            ResponseHandler.created(res, patient);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "creating patient",
                req.user?.id,
            );
        }
    }

    async updatePatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!validateRequiredParam(res, "id", id)) return;
            if (!checkOwnership(req, res, id as string, "patient")) return;

            const patient = await patientService.updatePatient(
                id as string,
                req.body,
            );
            ResponseHandler.success(res, patient);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "updating patient",
                req.user?.id,
            );
        }
    }

    async deletePatient(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!validateRequiredParam(res, "id", id)) return;
            if (!checkOwnership(req, res, id as string, "patient")) return;

            await patientService.deletePatient(id as string);
            ResponseHandler.noContent(res);
        } catch (error: any) {
            ResponseHandler.handle(
                error,
                res,
                "deleting patient",
                req.user?.id,
            );
        }
    }
}

export const patientController = new PatientController();

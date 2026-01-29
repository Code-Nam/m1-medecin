import { logger } from "../../config/logger";
import { clinicRepository } from "../../repositories/clinic/ClinicRepository";
import type { IClinicService } from "./IClinicService";

export class ClinicService implements IClinicService {
    constructor() {}

    async getClinic(clinicId: string) {
        const clinic = await clinicRepository.findClinicByExternalId(clinicId);
        if (!clinic) throw new Error("Clinic not found");
        return clinic;
    }

    async getClinics(page: number = 1, pageSize: number = 10) {
        const { clinics, total } = await clinicRepository.findClinics(
            page,
            pageSize
        );

        return {
            clinics,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            total,
        };
    }

    async createClinic(data: any) {
        const clinic = await clinicRepository.createClinic(data);
        logger.info(`Clinic created: ${clinic.clinicId}`);
        return clinic;
    }

    async updateClinic(clinicId: string, data: any) {
        const updateData: any = {};

        if (data.name) updateData.name = data.name;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.email !== undefined) updateData.email = data.email;

        const clinic = await clinicRepository.updateClinic(
            clinicId,
            updateData
        );
        logger.info(`Clinic updated: ${clinicId}`);
        return clinic;
    }

    async deleteClinic(clinicId: string) {
        await clinicRepository.deleteClinicByExternalId(clinicId);
        logger.info(`Clinic deleted: ${clinicId}`);
    }
}

export const clinicService = new ClinicService();

import { hashPassword, generateDefaultPassword } from "../../utils/password";
import { logger } from "../../config/logger";
import { secretaryRepository } from "../../repositories/secretary/SecretaryRepository";
import type { ISecretaryService } from "./ISecretaryService";
import type {
    CreateSecretaryDTO,
    UpdateSecretaryDTO,
} from "../../models/secretary";

export class SecretaryService implements ISecretaryService {
    constructor() {}

    async getSecretary(secretaryId: string) {
        const secretary =
            await secretaryRepository.findSecretaryById(secretaryId);

        if (!secretary) {
            throw new Error("Secretary not found");
        }

        const { password, ...secretaryWithoutPassword } = secretary;
        return secretaryWithoutPassword;
    }

    async getSecretaries(page: number = 1, pageSize: number = 10) {
        const { secretaries, total } =
            await secretaryRepository.findSecretaries(page, pageSize);

        return {
            secretaries,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            total,
        };
    }

    async createSecretary(data: any) {
        const password = data.password || generateDefaultPassword();
        const hashedPassword = await hashPassword(password);

        const doctorConnections: Array<{ doctorId: string }> = [];
        if (data.doctorIds && data.doctorIds.length > 0) {
            // doctorIds are the actual database IDs, so use them directly
            for (const doctorId of data.doctorIds) {
                doctorConnections.push({ doctorId });
            }
        }

        const payload: CreateSecretaryDTO = {
            firstName: data.firstName,
            surname: data.surname,
            email: data.email,
            password: hashedPassword,
            phone: data.phone ?? null,
            doctorConnections,
        };

        const secretary = await secretaryRepository.createSecretary(payload);
        const { password: _, ...secretaryWithoutPassword } = secretary;
        logger.info(`Secretary created: ${secretary.id}`);
        return secretaryWithoutPassword;
    }

    async updateSecretary(secretaryId: string, data: any) {
        const updateData: any = {};

        if (data.firstName) updateData.firstName = data.firstName;
        if (data.surname) updateData.surname = data.surname;
        if (data.email) updateData.email = data.email;
        if (data.password) {
            updateData.password = await hashPassword(data.password);
        }
        if (data.phone !== undefined) updateData.phone = data.phone;

        if (data.doctorIds !== undefined) {
            const sec =
                await secretaryRepository.findSecretaryById(secretaryId);
            if (!sec) throw new Error("Secretary not found");

            await secretaryRepository.removeDoctorRelationsForSecretary(sec.id);

            if (data.doctorIds.length > 0) {
                // doctorIds are the actual database IDs, so use them directly
                updateData.doctors = {
                    create: data.doctorIds.map((doctorId: string) => ({
                        doctorId,
                    })),
                };
            }
        }

        const payload: UpdateSecretaryDTO = updateData;
        const secretary = await secretaryRepository.updateSecretary(
            secretaryId,
            payload,
        );
        const { password, ...secretaryWithoutPassword } = secretary;
        logger.info(`Secretary updated: ${secretaryId}`);
        return secretaryWithoutPassword;
    }

    async deleteSecretary(secretaryId: string) {
        await secretaryRepository.deleteSecretaryById(secretaryId);
        logger.info(`Secretary deleted: ${secretaryId}`);
    }
}

export const secretaryService = new SecretaryService();

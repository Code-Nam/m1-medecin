import { logger } from "../../config/logger";
import { hashPassword, generateDefaultPassword } from "../../utils/password";
import { doctorRepository } from "../../repositories/doctor/DoctorRepository";
import type { IDoctorRepository } from "../../repositories/doctor/IDoctorRepository";
import type { CreateDoctorDTO, UpdateDoctorDTO } from "../../models/doctor";
import type { IDoctorService } from "./IDoctorService";

export class DoctorService implements IDoctorService {
    constructor(private repository: IDoctorRepository) {}

    async getDoctor(id: string) {
        const doctor = await this.repository.findDoctorById(id);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        return doctor;
    }

    async getDoctors(page: number = 1, pageSize: number = 10) {
        const { doctors, total } = await this.repository.findDoctors(
            page,
            pageSize,
        );

        return {
            doctors,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            total,
        };
    }

    async getAllDoctors() {
        const doctors = await this.repository.findAllDoctors();
        return doctors;
    }

    async createDoctor(data: {
        firstName: string;
        surname: string;
        email: string;
        password?: string;
        phone?: string;
        title?: string;
        specialization: string;
        openingTime?: string;
        closingTime?: string;
        slotDuration?: number;
    }) {
        const password = data.password || generateDefaultPassword();
        const hashedPassword = await hashPassword(password);

        const payload: CreateDoctorDTO = {
            firstName: data.firstName,
            surname: data.surname,
            email: data.email,
            password: hashedPassword,
            phone: data.phone ?? null,
            title: data.title ?? "Dr.",
            specialization: data.specialization,
            openingTime: data.openingTime ?? "09:00",
            closingTime: data.closingTime ?? "17:00",
            slotDuration: data.slotDuration ?? 30,
        };

        const doctor = await this.repository.createDoctor(payload);
        logger.info(`Doctor created: ${doctor.id}`);
        return doctor;
    }

    async updateDoctor(
        id: string,
        data: {
            firstName?: string;
            surname?: string;
            email?: string;
            password?: string;
            phone?: string;
            title?: string;
            specialization?: string;
            openingTime?: string;
            closingTime?: string;
            slotDuration?: number;
        },
    ) {
        const updateData: any = {};

        if (data.firstName) updateData.firstName = data.firstName;
        if (data.surname) updateData.surname = data.surname;
        if (data.email) updateData.email = data.email;
        if (data.password) {
            updateData.password = await hashPassword(data.password);
        }
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.title !== undefined) updateData.title = data.title;
        if (data.specialization)
            updateData.specialization = data.specialization;
        if (data.openingTime) updateData.openingTime = data.openingTime;
        if (data.closingTime) updateData.closingTime = data.closingTime;
        if (data.slotDuration !== undefined)
            updateData.slotDuration = data.slotDuration;

        const payload: UpdateDoctorDTO = updateData;
        const doctor = await this.repository.updateDoctor(id, payload);
        logger.info(`Doctor updated: ${id}`);
        return doctor;
    }

    async deleteDoctor(id: string) {
        await this.repository.deleteDoctorById(id);
        logger.info(`Doctor deleted: ${id}`);
    }

    async getPatientsByDoctor(
        doctorId: string,
        page: number = 1,
        pageSize: number = 10,
    ) {
        // doctorId is the actual database ID
        const { patients, total } =
            await this.repository.findPatientsByDoctorInternalId(
                doctorId,
                page,
                pageSize,
            );
        return {
            patients,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            total,
        };
    }
}

export const doctorService = new DoctorService(doctorRepository);

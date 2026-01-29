import { hashPassword, generateDefaultPassword } from "../../utils/password";
import { logger } from "../../config/logger";
import { patientRepository } from "../../repositories/patient/PatientRepository";
import type { IPatientRepository } from "../../repositories/patient/IPatientRepository";
import type { IPatientService } from "./IPatientService";

export class PatientService implements IPatientService {
    constructor(private repository: IPatientRepository = patientRepository) {}

    async getPatient(id: string) {
        const patient = await this.repository.findPatientById(id);

        if (!patient) {
            throw new Error("Patient not found");
        }

        const { password, ...patientWithoutPassword } = patient as any;
        return patientWithoutPassword;
    }

    async getPatients(
        page: number = 1,
        pageSize: number = 10,
        doctorId?: string
    ) {
        const where: any = doctorId ? { assignedDoctorId: doctorId } : {};
        const { patients, total } = await this.repository.findPatients(
            page,
            pageSize,
            where
        );

        logger.info(
            `✅ ${patients.length} patient(s) trouvé(s) sur ${total} total`
        );

        const transformedPatients = (patients as any[]).map((patient: any) => ({
            id: patient.id,
            firstName: patient.firstName,
            surname: patient.surname,
            email: patient.email,
            phone: patient.phone,
            dateOfBirth: patient.dateOfBirth,
            address: patient.address,
            assignedDoctor: patient.assignedDoctor
                ? {
                      id: patient.assignedDoctor.id,
                      firstName: patient.assignedDoctor.firstName,
                      surname: patient.assignedDoctor.surname,
                  }
                : null,
        }));

        return {
            patients: transformedPatients,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            total,
        };
    }

    async createPatient(data: any) {
        const password = data.password || generateDefaultPassword();
        const hashedPassword = await hashPassword(password);

        const dateOfBirth = data.dateOfBirth
            ? new Date(data.dateOfBirth)
            : null;

        const patient = await this.repository.createPatient({
            ...data,
            password: hashedPassword,
            dateOfBirth,
        });

        const { password: _, ...patientWithoutPassword } = patient as any;
        logger.info(`Patient created: ${patient.id}`);
        return patientWithoutPassword;
    }

    async updatePatient(id: string, data: any) {
        const updateData: any = {};

        if (data.firstName) updateData.firstName = data.firstName;
        if (data.surname) updateData.surname = data.surname;
        if (data.email) updateData.email = data.email;
        if (data.password) {
            updateData.password = await hashPassword(data.password);
        }
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.dateOfBirth) {
            updateData.dateOfBirth = new Date(data.dateOfBirth);
        }
        if (data.address !== undefined) updateData.address = data.address;
        if (data.assigned_doctor !== undefined) {
            updateData.assignedDoctorId = data.assigned_doctor || null;
        }

        const patient = await this.repository.updatePatient(id, updateData);

        const { password, ...patientWithoutPassword } = patient as any;
        logger.info(`Patient updated: ${id}`);
        return patientWithoutPassword;
    }

    async deletePatient(id: string) {
        await this.repository.deletePatientById(id);
        logger.info(`Patient deleted: ${id}`);
    }
}

export const patientService = new PatientService();

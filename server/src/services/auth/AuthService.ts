import {
    hashPassword,
    comparePassword,
    generateDefaultPassword,
} from "../../utils/password";
import { generateToken } from "../../utils/jwt";
import { logger } from "../../config/logger";
import { authRepository } from "../../repositories/auth/AuthRepository";
import type { IAuthService } from "./IAuthService";
import { ConflictError, UnauthorizedError } from "../../utils/responseHandler";

export class AuthService implements IAuthService {
    constructor() {}

    async registerPatient(patientData: any) {
        const existingPatient = await authRepository.findPatientByEmail(
            patientData.email,
        );

        if (existingPatient) {
            throw new ConflictError("Email already registered");
        }

        const hashedPassword = await hashPassword(patientData.password);

        const patient = await authRepository.createPatient({
            firstName: patientData.firstName,
            surname: patientData.surname,
            email: patientData.email,
            password: hashedPassword,
            phone: patientData.phone,
            dateOfBirth: patientData.dateOfBirth
                ? new Date(patientData.dateOfBirth)
                : null,
            address: patientData.address,
        });

        const token = generateToken({
            id: patient.id,
            email: patient.email,
            role: "PATIENT",
        });

        return {
            token,
            user: {
                id: patient.id,
                firstName: patient.firstName,
                surname: patient.surname,
                email: patient.email,
                role: "PATIENT",
            },
        };
    }

    async loginPatient(email: string, password: string) {
        const patient = await authRepository.findPatientByEmail(email);

        if (!patient) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isValid = await comparePassword(password, patient.password);
        if (!isValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = generateToken({
            id: patient.id,
            email: patient.email,
            role: "PATIENT",
        });

        return {
            token,
            user: {
                id: patient.id,
                firstName: patient.firstName,
                surname: patient.surname,
                email: patient.email,
                role: "PATIENT",
            },
        };
    }

    async loginDoctor(email: string, password: string) {
        const doctor = await authRepository.findDoctorByEmail(email);

        if (!doctor) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isValid = await comparePassword(password, doctor.password);
        if (!isValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = generateToken({
            id: doctor.id,
            email: doctor.email,
            role: "DOCTOR",
        });

        return {
            token,
            user: {
                id: doctor.id,
                firstName: doctor.firstName,
                surname: doctor.surname,
                email: doctor.email,
                role: "DOCTOR",
                title: doctor.title,
                specialization: doctor.specialization,
            },
        };
    }

    async loginSecretary(email: string, password: string) {
        const secretary = await authRepository.findSecretaryByEmail(email);

        if (!secretary) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const isValid = await comparePassword(password, secretary.password);
        if (!isValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        const token = generateToken({
            id: secretary.id,
            email: secretary.email,
            role: "SECRETARY",
        });

        return {
            token,
            user: {
                id: secretary.id,
                firstName: secretary.firstName,
                surname: secretary.surname,
                email: secretary.email,
                role: "SECRETARY",
                doctors: secretary.doctors.map((sd: any) => ({
                    id: sd.doctor.id,
                    firstName: sd.doctor.firstName,
                    surname: sd.doctor.surname,
                    title: sd.doctor.title,
                    specialization: sd.doctor.specialization,
                })),
            },
        };
    }
}

export const authService = new AuthService();

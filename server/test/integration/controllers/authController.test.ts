import request from "supertest";
import express from "express";
import type { Express } from "express";
import authRouter from "../../../src/routes/auth-router";
import { prisma } from "../../../src/config/database";
import { errorHandler } from "../../../src/middlewares/error-handler";
import bcrypt from "bcryptjs";
import * as passwordUtils from "../../../src/utils/password";

// Mock Prisma
jest.mock("../../../src/config/database", () => {
    const mockPrisma = {
        patient: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        doctor: {
            findUnique: jest.fn(),
        },
        secretary: {
            findUnique: jest.fn(),
        },
    };
    return {
        prisma: mockPrisma,
        default: mockPrisma, // Add default export for repositories that use it
    };
});

jest.mock("../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));
jest.mock("bcryptjs", () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn(),
    },
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    default: {
        sign: jest.fn(() => "mock-jwt-token"),
        verify: jest.fn(),
    },
    sign: jest.fn(() => "mock-jwt-token"),
    verify: jest.fn(),
}));

jest.mock("../../../src/utils/password", () => ({
    hashPassword: jest.fn((password: string) =>
        Promise.resolve(`hashed-${password}`),
    ),
    comparePassword: jest.fn((password: string, hashed: string) =>
        Promise.resolve(true),
    ),
    generateDefaultPassword: jest.fn(() => "default-password-123"),
}));

describe("AuthController - Integration Tests", () => {
    let app: Express;

    beforeAll(() => {
        // Setup Express app with auth routes
        app = express();
        app.use(express.json());
        app.use("/api/auth", authRouter);
        app.use(errorHandler); // Add error handler middleware
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/auth/patients/login", () => {
        it("should login patient with valid credentials", async () => {
            // Arrange
            const mockPatient = {
                id: "patient-123",
                email: "patient@test.com",
                password: "hashed-password-123",
                firstName: "John",
                surname: "Doe",
                phone: "1234567890",
                dateOfBirth: new Date("1990-01-01"),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(
                mockPatient,
            );
            (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(
                true,
            );

            // Act
            const response = await request(app)
                .post("/api/auth/patients/login")
                .send({
                    email: "patient@test.com",
                    password: "password123",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("user");
            expect(response.body.user.email).toBe("patient@test.com");
            expect(prisma.patient.findUnique).toHaveBeenCalledWith({
                where: { email: "patient@test.com" },
            });
        });

        it("should return 401 with invalid credentials", async () => {
            // Arrange
            const mockPatient = {
                id: "patient-123",
                email: "patient@test.com",
                password: "hashed-password-123",
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(
                mockPatient,
            );
            (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(
                false,
            );

            // Act
            const response = await request(app)
                .post("/api/auth/patients/login")
                .send({
                    email: "patient@test.com",
                    password: "wrong-password",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("error");
        });

        it("should return 401 when patient not found", async () => {
            // Arrange
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .post("/api/auth/patients/login")
                .send({
                    email: "nonexistent@test.com",
                    password: "password123",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("error");
        });

        it("should return 400 with missing email", async () => {
            // Act
            const response = await request(app)
                .post("/api/auth/patients/login")
                .send({
                    password: "password123",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(400);
        });

        it("should return 400 with missing password", async () => {
            // Act
            const response = await request(app)
                .post("/api/auth/patients/login")
                .send({
                    email: "patient@test.com",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(400);
        });
    });

    describe("POST /api/auth/patients/register", () => {
        it("should register new patient successfully", async () => {
            // Arrange
            const newPatientData = {
                email: "newpatient@test.com",
                password: "password123",
                firstName: "Jane",
                surname: "Doe",
                phone: "9876543210",
                dateOfBirth: "1995-05-15",
            };

            const mockCreatedPatient = {
                id: "new-patient-123",
                email: newPatientData.email,
                password: "hashed-password",
                firstName: newPatientData.firstName,
                surname: newPatientData.surname,
                phone: newPatientData.phone,
                dateOfBirth: new Date(newPatientData.dateOfBirth),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.patient.create as jest.Mock).mockResolvedValue(
                mockCreatedPatient,
            );
            (passwordUtils.hashPassword as jest.Mock).mockResolvedValue(
                "hashed-password",
            );

            // Act
            const response = await request(app)
                .post("/api/auth/patients/register")
                .send(newPatientData)
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("user");
            expect(response.body.user.email).toBe(newPatientData.email);
            expect(prisma.patient.create).toHaveBeenCalled();
        });

        it("should return 409 when email already exists", async () => {
            // Arrange
            const existingPatient = {
                id: "existing-patient",
                email: "existing@test.com",
                password: "hashed-password",
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(
                existingPatient,
            );

            // Act
            const response = await request(app)
                .post("/api/auth/patients/register")
                .send({
                    email: "existing@test.com",
                    password: "password123",
                    firstName: "John",
                    surname: "Doe",
                    phone: "1234567890",
                    dateOfBirth: "1990-01-01",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty("error");
            expect(prisma.patient.create).not.toHaveBeenCalled();
        });

        it("should return 400 with invalid email format", async () => {
            // Act
            const response = await request(app)
                .post("/api/auth/patients/register")
                .send({
                    email: "invalid-email",
                    password: "password123",
                    firstName: "John",
                    surname: "Doe",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(400);
        });

        it("should return 400 with missing required fields", async () => {
            // Act
            const response = await request(app)
                .post("/api/auth/patients/register")
                .send({
                    email: "test@test.com",
                    // missing password, firstName, surname
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(400);
        });
    });

    describe("POST /api/auth/doctors/login", () => {
        it("should login doctor with valid credentials", async () => {
            // Arrange
            const mockDoctor = {
                id: "doctor-123",
                email: "doctor@test.com",
                password: "hashed-password-123",
                firstName: "Dr. John",
                surname: "Smith",
                specialization: "Cardiology",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(
                mockDoctor,
            );
            (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(
                true,
            );

            // Act
            const response = await request(app)
                .post("/api/auth/doctors/login")
                .send({
                    email: "doctor@test.com",
                    password: "password123",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body.user.email).toBe("doctor@test.com");
        });

        it("should return 401 with invalid doctor credentials", async () => {
            // Arrange
            const mockDoctor = {
                id: "doctor-123",
                email: "doctor@test.com",
                password: "hashed-password-123",
            };

            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(
                mockDoctor,
            );
            (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(
                false,
            );

            // Act
            const response = await request(app)
                .post("/api/auth/doctors/login")
                .send({
                    email: "doctor@test.com",
                    password: "wrong-password",
                });

            // Assert
            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/auth/secretaries/login", () => {
        it("should login secretary with valid credentials", async () => {
            // Arrange
            const mockSecretary = {
                id: "secretary-123",
                email: "secretary@test.com",
                password: "hashed-password-123",
                firstName: "Alice",
                surname: "Johnson",
                doctors: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.secretary.findUnique as jest.Mock).mockResolvedValue(
                mockSecretary,
            );
            (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(
                true,
            );

            // Act
            const response = await request(app)
                .post("/api/auth/secretaries/login")
                .send({
                    email: "secretary@test.com",
                    password: "password123",
                })
                .expect("Content-Type", /json/);

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body.user.email).toBe("secretary@test.com");
        });

        it("should return 401 when secretary not found", async () => {
            // Arrange
            (prisma.secretary.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .post("/api/auth/secretaries/login")
                .send({
                    email: "nonexistent@test.com",
                    password: "password123",
                });

            // Assert
            expect(response.status).toBe(401);
        });
    });
});

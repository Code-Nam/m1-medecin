import request from "supertest";
import express from "express";
import type { Express } from "express";
import patientRouter from "../../../src/routes/patient-router";
import { prisma } from "../../../src/config/database";
import { errorHandler } from "../../../src/middlewares/error-handler";
import jwt from "jsonwebtoken";

// Mock Prisma
jest.mock("../../../src/config/database", () => {
    const mockPrisma = {
        patient: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    };
    return {
        prisma: mockPrisma,
        default: mockPrisma,
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
        Promise.resolve(`hashed-${password}`)
    ),
    comparePassword: jest.fn(() => Promise.resolve(true)),
}));

describe("PatientController - Integration Tests", () => {
    let app: Express;
    let authToken: string;

    beforeAll(() => {
        // Setup Express app with patient routes
        app = express();
        app.use(express.json());
        app.use("/api/patients", patientRouter);
        app.use(errorHandler);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        authToken = "Bearer mock-jwt-token";
        (jwt.verify as jest.Mock).mockReturnValue({
            id: "patient-123",
            role: "patient",
        });
    });

    describe("GET /api/patients/:id", () => {
        it("should get patient by id successfully", async () => {
            // Arrange
            const mockPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
                email: "alice.johnson@example.com",
                phone: "1234567890",
                dateOfBirth: new Date("1990-01-01"),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(
                mockPatient
            );

            // Act
            const response = await request(app)
                .get("/api/patients/patient-123")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("id", "patient-123");
            expect(response.body.data).toHaveProperty("firstName", "Alice");
            expect(response.body.data).not.toHaveProperty("password");
            expect(prisma.patient.findUnique).toHaveBeenCalledWith({
                where: { id: "patient-123" },
            });
        });

        it("should return 404 when patient not found", async () => {
            // Arrange
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .get("/api/patients/nonexistent-id")
                .set("Authorization", authToken)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("GET /api/patients", () => {
        it("should get all patients with pagination", async () => {
            // Arrange
            const mockPatients = [
                {
                    id: "patient-1",
                    firstName: "Alice",
                    surname: "Johnson",
                    email: "alice@example.com",
                    phone: "1234567890",
                    dateOfBirth: new Date("1990-01-01"),
                },
                {
                    id: "patient-2",
                    firstName: "Bob",
                    surname: "Williams",
                    email: "bob@example.com",
                    phone: "0987654321",
                    dateOfBirth: new Date("1985-05-15"),
                },
            ];

            (prisma.patient.findMany as jest.Mock).mockResolvedValue(
                mockPatients
            );
            (prisma.patient.count as jest.Mock).mockResolvedValue(2);

            // Act
            const response = await request(app)
                .get("/api/patients?page=1&pageSize=10")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data.patients).toHaveLength(2);
            expect(response.body.data.pagination).toHaveProperty("total", 2);
            expect(response.body.data.pagination).toHaveProperty("page", 1);
            expect(response.body.data.pagination).toHaveProperty(
                "pageSize",
                10
            );
        });

        it("should filter patients by doctorId", async () => {
            // Arrange
            const mockPatients = [
                {
                    id: "patient-1",
                    firstName: "Alice",
                    surname: "Johnson",
                    email: "alice@example.com",
                    dateOfBirth: new Date("1990-01-01"),
                },
            ];

            (prisma.patient.findMany as jest.Mock).mockResolvedValue(
                mockPatients
            );
            (prisma.patient.count as jest.Mock).mockResolvedValue(1);

            // Act
            const response = await request(app)
                .get("/api/patients?doctorId=doctor-123&page=1&pageSize=10")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data.patients).toHaveLength(1);
        });

        it("should use default pagination values", async () => {
            // Arrange
            (prisma.patient.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.patient.count as jest.Mock).mockResolvedValue(0);

            // Act
            const response = await request(app)
                .get("/api/patients")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data.pagination).toHaveProperty("page", 1);
            expect(response.body.data.pagination).toHaveProperty(
                "pageSize",
                10
            );
        });
    });

    describe("POST /api/patients", () => {
        it("should create patient successfully", async () => {
            // Arrange
            const patientData = {
                firstName: "Alice",
                surname: "Johnson",
                email: "alice.johnson@example.com",
                phone: "1234567890",
                dateOfBirth: "1990-01-01",
                password: "SecurePass123!",
            };

            const mockCreatedPatient = {
                id: "patient-123",
                ...patientData,
                dateOfBirth: new Date(patientData.dateOfBirth),
                password: "hashed-SecurePass123!",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.patient.create as jest.Mock).mockResolvedValue(
                mockCreatedPatient
            );

            // Act
            const response = await request(app)
                .post("/api/patients")
                .send(patientData)
                .expect(201);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("id", "patient-123");
            expect(response.body.data).toHaveProperty("firstName", "Alice");
            expect(response.body.data).not.toHaveProperty("password");
        });

        it("should return 400 for duplicate email", async () => {
            // Arrange
            const patientData = {
                firstName: "Alice",
                surname: "Johnson",
                email: "existing@example.com",
                phone: "1234567890",
                dateOfBirth: "1990-01-01",
                password: "SecurePass123!",
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue({
                id: "existing-patient",
                email: "existing@example.com",
            });

            // Act
            const response = await request(app)
                .post("/api/patients")
                .send(patientData)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });

        it("should return 400 for missing required fields", async () => {
            // Arrange
            const invalidData = {
                firstName: "Alice",
                // Missing required fields
            };

            // Act
            const response = await request(app)
                .post("/api/patients")
                .send(invalidData)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("PUT /api/patients/:id", () => {
        it("should update patient successfully", async () => {
            // Arrange
            const updateData = {
                phone: "0987654321",
                email: "newemail@example.com",
            };

            const mockExistingPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
                email: "alice@example.com",
                phone: "1234567890",
                dateOfBirth: new Date("1990-01-01"),
            };

            const mockUpdatedPatient = {
                ...mockExistingPatient,
                ...updateData,
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "patient-123",
                role: "patient",
            });
            (prisma.patient.findUnique as jest.Mock)
                .mockResolvedValueOnce(mockExistingPatient)
                .mockResolvedValueOnce(null); // For email uniqueness check
            (prisma.patient.update as jest.Mock).mockResolvedValue(
                mockUpdatedPatient
            );

            // Act
            const response = await request(app)
                .put("/api/patients/patient-123")
                .set("Authorization", authToken)
                .send(updateData)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("phone", "0987654321");
            expect(response.body.data).toHaveProperty(
                "email",
                "newemail@example.com"
            );
        });

        it("should return 404 when patient not found", async () => {
            // Arrange
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .put("/api/patients/nonexistent-id")
                .set("Authorization", authToken)
                .send({ phone: "0987654321" })
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });

        it("should return 403 for unauthorized update attempt", async () => {
            // Arrange
            (jwt.verify as jest.Mock).mockReturnValue({
                id: "different-patient",
                role: "patient",
            });

            const mockPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(
                mockPatient
            );

            // Act
            const response = await request(app)
                .put("/api/patients/patient-123")
                .set("Authorization", authToken)
                .send({ phone: "0987654321" })
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("DELETE /api/patients/:id", () => {
        it("should delete patient successfully", async () => {
            // Arrange
            const mockPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
                email: "alice@example.com",
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "patient-123",
                role: "patient",
            });
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (prisma.patient.delete as jest.Mock).mockResolvedValue(mockPatient);

            // Act
            const response = await request(app)
                .delete("/api/patients/patient-123")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(prisma.patient.delete).toHaveBeenCalledWith({
                where: { id: "patient-123" },
            });
        });

        it("should return 404 when patient not found", async () => {
            // Arrange
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .delete("/api/patients/nonexistent-id")
                .set("Authorization", authToken)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });

        it("should return 403 for unauthorized delete attempt", async () => {
            // Arrange
            (jwt.verify as jest.Mock).mockReturnValue({
                id: "different-patient",
                role: "patient",
            });

            const mockPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
            };

            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(
                mockPatient
            );

            // Act
            const response = await request(app)
                .delete("/api/patients/patient-123")
                .set("Authorization", authToken)
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });
});

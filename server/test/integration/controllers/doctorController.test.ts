import request from "supertest";
import express from "express";
import type { Express } from "express";
import doctorRouter from "../../../src/routes/doctor-router";
import { prisma } from "../../../src/config/database";
import { errorHandler } from "../../../src/middlewares/error-handler";
import jwt from "jsonwebtoken";

// Mock Prisma
jest.mock("../../../src/config/database", () => {
    const mockPrisma = {
        doctor: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        appointment: {
            findMany: jest.fn(),
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
    generateDefaultPassword: jest.fn(() => "default-password-123"),
}));

describe("DoctorController - Integration Tests", () => {
    let app: Express;
    let authToken: string;

    beforeAll(() => {
        // Setup Express app with doctor routes
        app = express();
        app.use(express.json());
        app.use("/api/doctors", doctorRouter);
        app.use(errorHandler);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        authToken = "Bearer mock-jwt-token";
        (jwt.verify as jest.Mock).mockReturnValue({
            id: "doctor-123",
            role: "doctor",
        });
    });

    describe("GET /api/doctors/:id", () => {
        it("should get doctor by id successfully", async () => {
            // Arrange
            const mockDoctor = {
                id: "doctor-123",
                firstName: "John",
                surname: "Smith",
                email: "john.smith@clinic.com",
                phone: "1234567890",
                specialization: "Cardiology",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(
                mockDoctor
            );

            // Act
            const response = await request(app)
                .get("/api/doctors/doctor-123")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("id", "doctor-123");
            expect(response.body.data).toHaveProperty("firstName", "John");
            expect(response.body.data).toHaveProperty(
                "specialization",
                "Cardiology"
            );
            expect(prisma.doctor.findUnique).toHaveBeenCalledWith({
                where: { id: "doctor-123" },
            });
        });

        it("should return 404 when doctor not found", async () => {
            // Arrange
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .get("/api/doctors/nonexistent-id")
                .set("Authorization", authToken)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("GET /api/doctors", () => {
        it("should get all doctors with pagination", async () => {
            // Arrange
            const mockDoctors = [
                {
                    id: "doctor-1",
                    firstName: "John",
                    surname: "Smith",
                    email: "john@clinic.com",
                    specialization: "Cardiology",
                },
                {
                    id: "doctor-2",
                    firstName: "Jane",
                    surname: "Doe",
                    email: "jane@clinic.com",
                    specialization: "Neurology",
                },
            ];

            (prisma.doctor.findMany as jest.Mock).mockResolvedValue(
                mockDoctors
            );
            (prisma.doctor.count as jest.Mock).mockResolvedValue(2);

            // Act
            const response = await request(app)
                .get("/api/doctors?page=1&pageSize=10")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data.doctors).toHaveLength(2);
            expect(response.body.data.pagination).toHaveProperty("total", 2);
            expect(response.body.data.pagination).toHaveProperty("page", 1);
            expect(response.body.data.pagination).toHaveProperty(
                "pageSize",
                10
            );
        });

        it("should use default pagination values", async () => {
            // Arrange
            (prisma.doctor.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.doctor.count as jest.Mock).mockResolvedValue(0);

            // Act
            const response = await request(app)
                .get("/api/doctors")
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

    describe("POST /api/doctors", () => {
        it("should create doctor successfully", async () => {
            // Arrange
            const doctorData = {
                firstName: "John",
                surname: "Smith",
                email: "john.smith@clinic.com",
                phone: "1234567890",
                specialization: "Cardiology",
            };

            const mockCreatedDoctor = {
                id: "doctor-123",
                ...doctorData,
                password: "hashed-default-password-123",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.doctor.create as jest.Mock).mockResolvedValue(
                mockCreatedDoctor
            );

            // Act
            const response = await request(app)
                .post("/api/doctors")
                .set("Authorization", authToken)
                .send(doctorData)
                .expect(201);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("id", "doctor-123");
            expect(response.body.data).toHaveProperty("firstName", "John");
            expect(response.body.data).not.toHaveProperty("password");
        });

        it("should return 400 for duplicate email", async () => {
            // Arrange
            const doctorData = {
                firstName: "John",
                surname: "Smith",
                email: "existing@clinic.com",
                phone: "1234567890",
                specialization: "Cardiology",
            };

            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue({
                id: "existing-doctor",
                email: "existing@clinic.com",
            });

            // Act
            const response = await request(app)
                .post("/api/doctors")
                .set("Authorization", authToken)
                .send(doctorData)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("PUT /api/doctors/:id", () => {
        it("should update doctor successfully", async () => {
            // Arrange
            const updateData = {
                specialization: "Neurology",
                phone: "0987654321",
            };

            const mockExistingDoctor = {
                id: "doctor-123",
                firstName: "John",
                surname: "Smith",
                email: "john@clinic.com",
                specialization: "Cardiology",
            };

            const mockUpdatedDoctor = {
                ...mockExistingDoctor,
                ...updateData,
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "doctor-123",
                role: "doctor",
            });
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(
                mockExistingDoctor
            );
            (prisma.doctor.update as jest.Mock).mockResolvedValue(
                mockUpdatedDoctor
            );

            // Act
            const response = await request(app)
                .put("/api/doctors/doctor-123")
                .set("Authorization", authToken)
                .send(updateData)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty(
                "specialization",
                "Neurology"
            );
            expect(response.body.data).toHaveProperty("phone", "0987654321");
        });

        it("should return 404 when doctor not found", async () => {
            // Arrange
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .put("/api/doctors/nonexistent-id")
                .set("Authorization", authToken)
                .send({ specialization: "Neurology" })
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("DELETE /api/doctors/:id", () => {
        it("should delete doctor successfully", async () => {
            // Arrange
            const mockDoctor = {
                id: "doctor-123",
                firstName: "John",
                surname: "Smith",
                email: "john@clinic.com",
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "doctor-123",
                role: "doctor",
            });
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (prisma.doctor.delete as jest.Mock).mockResolvedValue(mockDoctor);

            // Act
            const response = await request(app)
                .delete("/api/doctors/doctor-123")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(prisma.doctor.delete).toHaveBeenCalledWith({
                where: { id: "doctor-123" },
            });
        });

        it("should return 404 when doctor not found", async () => {
            // Arrange
            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .delete("/api/doctors/nonexistent-id")
                .set("Authorization", authToken)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("GET /api/doctors/:doctorId/patients", () => {
        it("should get patients by doctor id successfully", async () => {
            // Arrange
            const mockPatients = [
                {
                    patient: {
                        id: "patient-1",
                        firstName: "Alice",
                        surname: "Johnson",
                        email: "alice@example.com",
                    },
                },
                {
                    patient: {
                        id: "patient-2",
                        firstName: "Bob",
                        surname: "Williams",
                        email: "bob@example.com",
                    },
                },
            ];

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "doctor-123",
                role: "doctor",
            });
            (prisma.appointment.findMany as jest.Mock).mockResolvedValue(
                mockPatients
            );
            (prisma.appointment.count as jest.Mock).mockResolvedValue(2);

            // Act
            const response = await request(app)
                .get("/api/doctors/doctor-123/patients?page=1&pageSize=10")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data.patients).toHaveLength(2);
            expect(response.body.data.pagination).toHaveProperty("total", 2);
        });
    });
});

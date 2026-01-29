import request from "supertest";
import express from "express";
import type { Express } from "express";
import appointmentRouter from "../../../src/routes/appointment-router";
import { prisma } from "../../../src/config/database";
import { errorHandler } from "../../../src/middlewares/error-handler";
import jwt from "jsonwebtoken";

// Mock Prisma
jest.mock("../../../src/config/database", () => {
    const mockPrisma = {
        appointment: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        doctor: {
            findUnique: jest.fn(),
        },
        patient: {
            findUnique: jest.fn(),
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

describe("AppointmentController - Integration Tests", () => {
    let app: Express;
    let authToken: string;

    beforeAll(() => {
        // Setup Express app with appointment routes
        app = express();
        app.use(express.json());
        app.use("/api/appointments", appointmentRouter);
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

    describe("GET /api/appointments/:appointmentId", () => {
        it("should get appointment by id successfully for patient", async () => {
            // Arrange
            const mockAppointment = {
                id: "appointment-123",
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                date: new Date("2026-02-15"),
                startTime: "10:00",
                endTime: "10:30",
                status: "SCHEDULED",
                reason: "Regular checkup",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            const response = await request(app)
                .get("/api/appointments/appointment-123")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("id", "appointment-123");
            expect(response.body.data).toHaveProperty("patientId", "patient-123");
            expect(response.body.data).toHaveProperty("status", "SCHEDULED");
        });

        it("should get appointment by id successfully for doctor", async () => {
            // Arrange
            const mockAppointment = {
                id: "appointment-123",
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                date: new Date("2026-02-15"),
                startTime: "10:00",
                endTime: "10:30",
                status: "SCHEDULED",
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "doctor-456",
                role: "doctor",
            });
            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            const response = await request(app)
                .get("/api/appointments/appointment-123")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("doctorId", "doctor-456");
        });

        it("should return 404 when appointment not found", async () => {
            // Arrange
            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .get("/api/appointments/nonexistent-id")
                .set("Authorization", authToken)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });

        it("should return 403 for unauthorized access", async () => {
            // Arrange
            const mockAppointment = {
                id: "appointment-123",
                patientId: "different-patient",
                doctorId: "different-doctor",
                status: "SCHEDULED",
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "patient-123",
                role: "patient",
            });
            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            const response = await request(app)
                .get("/api/appointments/appointment-123")
                .set("Authorization", authToken)
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("GET /api/appointments/patient/:patientId", () => {
        it("should get appointments by patient id successfully", async () => {
            // Arrange
            const mockAppointments = [
                {
                    id: "appointment-1",
                    appointedPatient: "patient-123",
                    appointedDoctor: "doctor-456",
                    date: new Date("2026-02-15"),
                    startTime: "10:00",
                    endTime: "10:30",
                    status: "SCHEDULED",
                },
                {
                    id: "appointment-2",
                    appointedPatient: "patient-123",
                    appointedDoctor: "doctor-789",
                    date: new Date("2026-02-16"),
                    startTime: "14:00",
                    endTime: "14:30",
                    status: "SCHEDULED",
                },
            ];

            (prisma.appointment.findMany as jest.Mock).mockResolvedValue(
                mockAppointments
            );
            (prisma.appointment.count as jest.Mock).mockResolvedValue(2);

            // Act
            const response = await request(app)
                .get("/api/appointments/patient/patient-123?page=1&pageSize=10")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data.appointments).toHaveLength(2);
            expect(response.body.data.pagination).toHaveProperty("total", 2);
        });

        it("should return 403 for unauthorized patient access", async () => {
            // Arrange
            (jwt.verify as jest.Mock).mockReturnValue({
                id: "different-patient",
                role: "patient",
            });

            // Act
            const response = await request(app)
                .get("/api/appointments/patient/patient-123")
                .set("Authorization", authToken)
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("GET /api/appointments/doctor/:doctorId", () => {
        it("should get appointments by doctor id successfully", async () => {
            // Arrange
            const mockAppointments = [
                {
                    id: "appointment-1",
                    appointedPatient: "patient-123",
                    appointedDoctor: "doctor-456",
                    date: new Date("2026-02-15"),
                    startTime: "10:00",
                    endTime: "10:30",
                    status: "SCHEDULED",
                },
                {
                    id: "appointment-2",
                    appointedPatient: "patient-789",
                    appointedDoctor: "doctor-456",
                    date: new Date("2026-02-16"),
                    startTime: "14:00",
                    endTime: "14:30",
                    status: "SCHEDULED",
                },
            ];

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "doctor-456",
                role: "doctor",
            });
            (prisma.appointment.findMany as jest.Mock).mockResolvedValue(
                mockAppointments
            );
            (prisma.appointment.count as jest.Mock).mockResolvedValue(2);

            // Act
            const response = await request(app)
                .get("/api/appointments/doctor/doctor-456?page=1&pageSize=10")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data.appointments).toHaveLength(2);
            expect(response.body.data.pagination).toHaveProperty("total", 2);
        });

        it("should return 403 for unauthorized doctor access", async () => {
            // Arrange
            (jwt.verify as jest.Mock).mockReturnValue({
                id: "different-doctor",
                role: "doctor",
            });

            // Act
            const response = await request(app)
                .get("/api/appointments/doctor/doctor-456")
                .set("Authorization", authToken)
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("POST /api/appointments", () => {
        it("should create appointment successfully", async () => {
            // Arrange
            const appointmentData = {
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                date: "2026-02-15",
                startTime: "10:00",
                endTime: "10:30",
                reason: "Regular checkup",
            };

            const mockCreatedAppointment = {
                id: "appointment-123",
                ...appointmentData,
                date: new Date(appointmentData.date),
                status: "SCHEDULED",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockDoctor = {
                id: "doctor-456",
                firstName: "John",
                surname: "Smith",
            };

            const mockPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
            };

            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(mockDoctor);
            (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);
            (prisma.appointment.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.appointment.create as jest.Mock).mockResolvedValue(
                mockCreatedAppointment
            );

            // Act
            const response = await request(app)
                .post("/api/appointments")
                .set("Authorization", authToken)
                .send(appointmentData)
                .expect(201);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("id", "appointment-123");
            expect(response.body.data).toHaveProperty("status", "SCHEDULED");
        });

        it("should return 400 for missing required fields", async () => {
            // Arrange
            const invalidData = {
                appointedPatient: "patient-123",
                // Missing required fields
            };

            // Act
            const response = await request(app)
                .post("/api/appointments")
                .set("Authorization", authToken)
                .send(invalidData)
                .expect(400);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });

        it("should return 404 when doctor not found", async () => {
            // Arrange
            const appointmentData = {
                appointedPatient: "patient-123",
                doctorId: "nonexistent-doctor",
                date: "2026-02-15",
                startTime: "10:00",
                endTime: "10:30",
            };

            (prisma.doctor.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .post("/api/appointments")
                .set("Authorization", authToken)
                .send(appointmentData)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("PUT /api/appointments/:appointmentId", () => {
        it("should update appointment successfully", async () => {
            // Arrange
            const updateData = {
                date: "2026-02-20",
                startTime: "14:00",
                endTime: "14:30",
            };

            const mockExistingAppointment = {
                id: "appointment-123",
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                date: new Date("2026-02-15"),
                startTime: "10:00",
                endTime: "10:30",
                status: "SCHEDULED",
            };

            const mockUpdatedAppointment = {
                ...mockExistingAppointment,
                ...updateData,
                date: new Date(updateData.date),
            };

            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(
                mockExistingAppointment
            );
            (prisma.appointment.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.appointment.update as jest.Mock).mockResolvedValue(
                mockUpdatedAppointment
            );

            // Act
            const response = await request(app)
                .put("/api/appointments/appointment-123")
                .set("Authorization", authToken)
                .send(updateData)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.data).toHaveProperty("startTime", "14:00");
            expect(response.body.data).toHaveProperty("endTime", "14:30");
        });

        it("should return 404 when appointment not found", async () => {
            // Arrange
            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .put("/api/appointments/nonexistent-id")
                .set("Authorization", authToken)
                .send({ date: "2026-02-20" })
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });

        it("should return 403 for unauthorized update", async () => {
            // Arrange
            const mockAppointment = {
                id: "appointment-123",
                patientId: "different-patient",
                doctorId: "different-doctor",
                status: "SCHEDULED",
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "patient-123",
                role: "patient",
            });
            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            const response = await request(app)
                .put("/api/appointments/appointment-123")
                .set("Authorization", authToken)
                .send({ date: "2026-02-20" })
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });

    describe("DELETE /api/appointments/:appointmentId", () => {
        it("should delete appointment successfully", async () => {
            // Arrange
            const mockAppointment = {
                id: "appointment-123",
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                status: "SCHEDULED",
            };

            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(
                mockAppointment
            );
            (prisma.appointment.delete as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            const response = await request(app)
                .delete("/api/appointments/appointment-123")
                .set("Authorization", authToken)
                .expect(200);

            // Assert
            expect(response.body).toHaveProperty("success", true);
            expect(prisma.appointment.delete).toHaveBeenCalledWith({
                where: { id: "appointment-123" },
            });
        });

        it("should return 404 when appointment not found", async () => {
            // Arrange
            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(null);

            // Act
            const response = await request(app)
                .delete("/api/appointments/nonexistent-id")
                .set("Authorization", authToken)
                .expect(404);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });

        it("should return 403 for unauthorized delete", async () => {
            // Arrange
            const mockAppointment = {
                id: "appointment-123",
                patientId: "different-patient",
                doctorId: "different-doctor",
                status: "SCHEDULED",
            };

            (jwt.verify as jest.Mock).mockReturnValue({
                id: "patient-123",
                role: "patient",
            });
            (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            const response = await request(app)
                .delete("/api/appointments/appointment-123")
                .set("Authorization", authToken)
                .expect(403);

            // Assert
            expect(response.body).toHaveProperty("success", false);
        });
    });
});

import type { Response } from "express";
import { AppointmentController } from "../../../src/controllers/appointment/AppointmentController";
import { appointmentService } from "../../../src/services/appointment/AppointmentService";
import type { AuthRequest } from "../../../src/middlewares/auth-middleware";

// Mock dependencies
jest.mock("../../../src/services/appointment/AppointmentService", () => ({
    appointmentService: {
        getAppointmentById: jest.fn(),
        getAppointmentsByPatient: jest.fn(),
        getAppointmentsByDoctor: jest.fn(),
        createAppointment: jest.fn(),
        updateAppointment: jest.fn(),
        deleteAppointment: jest.fn(),
    },
}));
jest.mock("../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

describe("AppointmentController - Unit Tests", () => {
    let appointmentController: AppointmentController;
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Initialize controller
        appointmentController = new AppointmentController();

        // Create mock response
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockResponse = {
            status: mockStatus,
            json: mockJson,
        };

        // Create mock request
        mockRequest = {
            body: {},
            params: {},
            query: {},
            user: {
                id: "user-123",
                role: "PATIENT",
            },
        };
    });

    describe("getAppointmentById", () => {
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
            };

            mockRequest.params = { appointmentId: "appointment-123" };
            mockRequest.user = { id: "patient-123", email: "test@test.com", role: "PATIENT" };
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            await appointmentController.getAppointmentById(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(
                "appointment-123"
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockAppointment);
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

            mockRequest.params = { appointmentId: "appointment-123" };
            mockRequest.user = { id: "doctor-456", email: "test@test.com", role: "DOCTOR" };
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(
                mockAppointment
            );

            // Act
            await appointmentController.getAppointmentById(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.getAppointmentById).toHaveBeenCalledWith(
                "appointment-123"
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        it("should return 400 when appointmentId is missing", async () => {
            // Arrange
            mockRequest.params = {};

            // Act
            await appointmentController.getAppointmentById(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.getAppointmentById).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });

        it("should handle service errors", async () => {
            // Arrange
            mockRequest.params = { appointmentId: "appointment-123" };
            const error = new Error("Service error");
            (appointmentService.getAppointmentById as jest.Mock).mockRejectedValue(
                error
            );

            // Act
            await appointmentController.getAppointmentById(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("getAppointmentsByPatient", () => {
        it("should get appointments by patient id successfully", async () => {
            // Arrange
            const mockResult = {
                appointments: [
                    {
                        id: "appointment-1",
                        appointedPatient: "patient-123",
                        date: new Date("2026-02-15"),
                    },
                    {
                        id: "appointment-2",
                        appointedPatient: "patient-123",
                        date: new Date("2026-02-16"),
                    },
                ],
                pagination: {
                    total: 2,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                },
            };

            mockRequest.params = { appointedPatient: "patient-123" };
            mockRequest.query = { page: "1", pageSize: "10" };
            mockRequest.user = { id: "patient-123", email: "test@test.com", role: "PATIENT" };
            (appointmentService.getAppointmentsByPatient as jest.Mock).mockResolvedValue(
                mockResult
            );

            // Act
            await appointmentController.getAppointmentsByQuery(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.getAppointmentsByPatient).toHaveBeenCalledWith(
                "patient-123",
                1,
                10
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockResult);
        });
    });

    describe("getAppointmentsByDoctor", () => {
        it("should get appointments by doctor id successfully", async () => {
            // Arrange
            const mockResult = {
                appointments: [
                    {
                        id: "appointment-1",
                        appointedDoctor: "doctor-123",
                        date: new Date("2026-02-15"),
                    },
                    {
                        id: "appointment-2",
                        appointedDoctor: "doctor-123",
                        date: new Date("2026-02-16"),
                    },
                ],
                pagination: {
                    total: 2,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                },
            };

            mockRequest.params = { appointedDoctor: "doctor-123" };
            mockRequest.query = { page: "1", pageSize: "10" };
            mockRequest.user = { id: "doctor-123", email: "test@test.com", role: "DOCTOR" };
            (appointmentService.getAppointmentsByDoctor as jest.Mock).mockResolvedValue(
                mockResult
            );

            // Act
            await appointmentController.getAppointmentsByQuery(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.getAppointmentsByDoctor).toHaveBeenCalledWith(
                "doctor-123",
                1,
                10
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    describe("createAppointment", () => {
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
            };

            mockRequest.body = appointmentData;
            mockRequest.user = { id: "patient-123", email: "test@test.com", role: "PATIENT" };
            (appointmentService.createAppointment as jest.Mock).mockResolvedValue(
                mockCreatedAppointment
            );

            // Act
            await appointmentController.createAppointment(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.createAppointment).toHaveBeenCalledWith(
                appointmentData
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCreatedAppointment);
        });

        it("should handle validation errors", async () => {
            // Arrange
            mockRequest.body = { appointedPatient: "patient-123" }; // Missing required fields
            const error = new Error("Validation error");
            (appointmentService.createAppointment as jest.Mock).mockRejectedValue(
                error
            );

            // Act
            await appointmentController.createAppointment(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("updateAppointment", () => {
        it("should update appointment successfully", async () => {
            // Arrange
            const updateData = {
                date: "2026-02-20",
                startTime: "14:00",
                endTime: "14:30",
            };

            const mockUpdatedAppointment = {
                id: "appointment-123",
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                ...updateData,
                date: new Date(updateData.date),
                status: "SCHEDULED",
            };

            const mockExistingAppointment = {
                id: "appointment-123",
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                status: "SCHEDULED",
            };

            mockRequest.params = { appointmentId: "appointment-123" };
            mockRequest.body = updateData;
            mockRequest.user = { id: "patient-123", email: "test@test.com", role: "PATIENT" };
            
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(
                mockExistingAppointment
            );
            (appointmentService.updateAppointment as jest.Mock).mockResolvedValue(
                mockUpdatedAppointment
            );

            // Act
            await appointmentController.updateAppointment(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.updateAppointment).toHaveBeenCalledWith(
                "appointment-123",
                updateData
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockUpdatedAppointment);
        });

        it("should return 400 when appointmentId is missing", async () => {
            // Arrange
            mockRequest.params = {};
            mockRequest.body = { date: "2026-02-20" };

            // Act
            await appointmentController.updateAppointment(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.updateAppointment).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });
    });

    describe("deleteAppointment", () => {
        it("should delete appointment successfully", async () => {
            // Arrange
            const mockExistingAppointment = {
                id: "appointment-123",
                appointedPatient: "patient-123",
                appointedDoctor: "doctor-456",
                status: "SCHEDULED",
            };

            mockRequest.params = { appointmentId: "appointment-123" };
            mockRequest.user = { id: "patient-123", email: "test@test.com", role: "PATIENT" };
            
            (appointmentService.getAppointmentById as jest.Mock).mockResolvedValue(
                mockExistingAppointment
            );
            (appointmentService.deleteAppointment as jest.Mock).mockResolvedValue(
                undefined
            );

            // Act
            await appointmentController.deleteAppointment(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.deleteAppointment).toHaveBeenCalledWith(
                "appointment-123"
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: expect.any(String),
            });
        });

        it("should return 400 when appointmentId is missing", async () => {
            // Arrange
            mockRequest.params = {};

            // Act
            await appointmentController.deleteAppointment(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(appointmentService.deleteAppointment).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });
    });
});

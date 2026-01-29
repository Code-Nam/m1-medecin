import type { Response } from "express";
import { PatientController } from "../../../src/controllers/patient/PatientController";
import { patientService } from "../../../src/services/patient/PatientService";
import type { AuthRequest } from "../../../src/middlewares/auth-middleware";

// Mock dependencies
jest.mock("../../../src/services/patient/PatientService", () => ({
    patientService: {
        getPatient: jest.fn(),
        getPatients: jest.fn(),
        createPatient: jest.fn(),
        updatePatient: jest.fn(),
        deletePatient: jest.fn(),
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

describe("PatientController - Unit Tests", () => {
    let patientController: PatientController;
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Initialize controller
        patientController = new PatientController();

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
                email: "user@email.com"
            },
        };
    });

    describe("getPatient", () => {
        it("should get patient by id successfully", async () => {
            // Arrange
            const mockPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
                email: "alice.johnson@example.com",
                phone: "1234567890",
                dateOfBirth: new Date("1990-01-01"),
            };

            mockRequest.params = { id: "patient-123" };
            (patientService.getPatient as jest.Mock).mockResolvedValue(
                mockPatient
            );

            // Act
            await patientController.getPatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.getPatient).toHaveBeenCalledWith(
                "patient-123"
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockPatient);
        });

        it("should return 400 when id is missing", async () => {
            // Arrange
            mockRequest.params = {};

            // Act
            await patientController.getPatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.getPatient).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });

        it("should handle service errors", async () => {
            // Arrange
            mockRequest.params = { id: "patient-123" };
            const error = new Error("Service error");
            (patientService.getPatient as jest.Mock).mockRejectedValue(error);

            // Act
            await patientController.getPatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("getPatients", () => {
        it("should get all patients with pagination", async () => {
            // Arrange
            const mockResult = {
                patients: [
                    { id: "patient-1", firstName: "Alice", surname: "Johnson" },
                    { id: "patient-2", firstName: "Bob", surname: "Williams" },
                ],
                pagination: {
                    total: 2,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                },
            };

            mockRequest.query = { page: "1", pageSize: "10" };
            (patientService.getPatients as jest.Mock).mockResolvedValue(
                mockResult
            );

            // Act
            await patientController.getPatients(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.getPatients).toHaveBeenCalledWith(
                1,
                10,
                undefined
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockResult);
        });

        it("should filter patients by doctorId", async () => {
            // Arrange
            const mockResult = {
                patients: [
                    { id: "patient-1", firstName: "Alice", surname: "Johnson" },
                ],
                pagination: {
                    total: 1,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                },
            };

            mockRequest.query = {
                page: "1",
                pageSize: "10",
                doctorId: "doctor-123",
            };
            (patientService.getPatients as jest.Mock).mockResolvedValue(
                mockResult
            );

            // Act
            await patientController.getPatients(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.getPatients).toHaveBeenCalledWith(
                1,
                10,
                "doctor-123"
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
        });

        it("should use default pagination when not provided", async () => {
            // Arrange
            const mockResult = {
                patients: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 10,
                    totalPages: 0,
                },
            };

            mockRequest.query = {};
            (patientService.getPatients as jest.Mock).mockResolvedValue(
                mockResult
            );

            // Act
            await patientController.getPatients(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.getPatients).toHaveBeenCalledWith(
                1,
                10,
                undefined
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    describe("createPatient", () => {
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
            };

            mockRequest.body = patientData;
            (patientService.createPatient as jest.Mock).mockResolvedValue(
                mockCreatedPatient
            );

            // Act
            await patientController.createPatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.createPatient).toHaveBeenCalledWith(
                patientData
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCreatedPatient);
        });

        it("should handle validation errors", async () => {
            // Arrange
            mockRequest.body = { firstName: "Alice" }; // Missing required fields
            const error = new Error("Validation error");
            (patientService.createPatient as jest.Mock).mockRejectedValue(
                error
            );

            // Act
            await patientController.createPatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("updatePatient", () => {
        it("should update patient successfully", async () => {
            // Arrange
            const updateData = {
                phone: "0987654321",
                email: "newemail@example.com",
            };

            const mockUpdatedPatient = {
                id: "patient-123",
                firstName: "Alice",
                surname: "Johnson",
                ...updateData,
            };

            mockRequest.params = { id: "patient-123" };
            mockRequest.body = updateData;
            mockRequest.user = {
                id: "patient-123",
                role: "PATIENT",
                email: "patient@test.com",
            };
            (patientService.updatePatient as jest.Mock).mockResolvedValue(
                mockUpdatedPatient
            );

            // Act
            await patientController.updatePatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.updatePatient).toHaveBeenCalledWith(
                "patient-123",
                updateData
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockUpdatedPatient);
        });

        it("should return 400 when id is missing", async () => {
            // Arrange
            mockRequest.params = {};
            mockRequest.body = { phone: "0987654321" };

            // Act
            await patientController.updatePatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.updatePatient).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });

        it("should handle unauthorized access", async () => {
            // Arrange
            mockRequest.params = { id: "patient-123" };
            mockRequest.body = { phone: "0987654321" };
            mockRequest.user = {
                id: "different-user",
                role: "PATIENT",
                email: "other@test.com",
            };

            // Act
            await patientController.updatePatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(403);
        });
    });

    describe("deletePatient", () => {
        it("should delete patient successfully", async () => {
            // Arrange
            mockRequest.params = { id: "patient-123" };
            mockRequest.user = {
                id: "patient-123",
                role: "PATIENT",
                email: "patient@test.com",
            };
            (patientService.deletePatient as jest.Mock).mockResolvedValue(
                undefined
            );

            // Act
            await patientController.deletePatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.deletePatient).toHaveBeenCalledWith(
                "patient-123"
            );
            expect(mockStatus).toHaveBeenCalledWith(204);
        });

        it("should return 400 when id is missing", async () => {
            // Arrange
            mockRequest.params = {};

            // Act
            await patientController.deletePatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(patientService.deletePatient).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });

        it("should handle unauthorized access", async () => {
            // Arrange
            mockRequest.params = { id: "patient-123" };
            mockRequest.user = {
                id: "different-user",
                role: "PATIENT",
                email: "other@test.com",
            };

            // Act
            await patientController.deletePatient(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(403);
        });
    });
});

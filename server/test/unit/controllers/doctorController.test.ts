import type { Response } from "express";
import { DoctorController } from "../../../src/controllers/doctor/DoctorController";
import { doctorService } from "../../../src/services/doctor/DoctorService";
import type { AuthRequest } from "../../../src/middlewares/auth-middleware";

// Mock dependencies
jest.mock("../../../src/services/doctor/DoctorService", () => ({
    doctorService: {
        getDoctor: jest.fn(),
        getDoctors: jest.fn(),
        createDoctor: jest.fn(),
        updateDoctor: jest.fn(),
        deleteDoctor: jest.fn(),
        getPatientsByDoctor: jest.fn(),
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

describe("DoctorController - Unit Tests", () => {
    let doctorController: DoctorController;
    let mockRequest: Partial<AuthRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Initialize controller
        doctorController = new DoctorController();

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
                role: "DOCTOR",
                email: "user@email.com"
            },
        };
    });

    describe("getDoctor", () => {
        it("should get doctor by id successfully", async () => {
            // Arrange
            const mockDoctor = {
                id: "doctor-123",
                firstName: "John",
                surname: "Smith",
                email: "john.smith@clinic.com",
                specialization: "Cardiology",
            };

            mockRequest.params = { id: "doctor-123" };
            (doctorService.getDoctor as jest.Mock).mockResolvedValue(
                mockDoctor
            );

            // Act
            await doctorController.getDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.getDoctor).toHaveBeenCalledWith("doctor-123");
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockDoctor);
        });

        it("should return 400 when id is missing", async () => {
            // Arrange
            mockRequest.params = {};

            // Act
            await doctorController.getDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.getDoctor).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });

        it("should handle service errors", async () => {
            // Arrange
            mockRequest.params = { id: "doctor-123" };
            const error = new Error("Service error");
            (doctorService.getDoctor as jest.Mock).mockRejectedValue(error);

            // Act
            await doctorController.getDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("getDoctors", () => {
        it("should get all doctors with pagination", async () => {
            // Arrange
            const mockResult = {
                doctors: [
                    { id: "doctor-1", firstName: "John", surname: "Smith" },
                    { id: "doctor-2", firstName: "Jane", surname: "Doe" },
                ],
                pagination: {
                    total: 2,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                },
            };

            mockRequest.query = { page: "1", pageSize: "10" };
            (doctorService.getDoctors as jest.Mock).mockResolvedValue(
                mockResult
            );

            // Act
            await doctorController.getDoctors(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.getDoctors).toHaveBeenCalledWith(1, 10);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockResult);
        });

        it("should use default pagination when not provided", async () => {
            // Arrange
            const mockResult = {
                doctors: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 10,
                    totalPages: 0,
                },
            };

            mockRequest.query = {};
            (doctorService.getDoctors as jest.Mock).mockResolvedValue(
                mockResult
            );

            // Act
            await doctorController.getDoctors(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.getDoctors).toHaveBeenCalledWith(1, 10);
            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    describe("createDoctor", () => {
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
            };

            mockRequest.body = doctorData;
            (doctorService.createDoctor as jest.Mock).mockResolvedValue(
                mockCreatedDoctor
            );

            // Act
            await doctorController.createDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorData);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                message:
                    "Doctor creation request received and is under review.",
                doctor: mockCreatedDoctor,
            });
        });

        it("should handle validation errors", async () => {
            // Arrange
            mockRequest.body = { firstName: "John" }; // Missing required fields
            const error = new Error("Validation error");
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error);

            // Act
            await doctorController.createDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("updateDoctor", () => {
        it("should update doctor successfully", async () => {
            // Arrange
            const updateData = {
                specialization: "Neurology",
                phone: "0987654321",
            };

            const mockUpdatedDoctor = {
                id: "doctor-123",
                firstName: "John",
                surname: "Smith",
                ...updateData,
            };

            mockRequest.params = { id: "doctor-123" };
            mockRequest.body = updateData;
            mockRequest.user = {
                id: "doctor-123",
                email: "test@test.com",
                role: "DOCTOR",
            };
            (doctorService.updateDoctor as jest.Mock).mockResolvedValue(
                mockUpdatedDoctor
            );

            // Act
            await doctorController.updateDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.updateDoctor).toHaveBeenCalledWith(
                "doctor-123",
                updateData
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockUpdatedDoctor);
        });

        it("should return 400 when id is missing", async () => {
            // Arrange
            mockRequest.params = {};
            mockRequest.body = { specialization: "Neurology" };

            // Act
            await doctorController.updateDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.updateDoctor).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });
    });

    describe("deleteDoctor", () => {
        it("should delete doctor successfully", async () => {
            // Arrange
            mockRequest.params = { id: "doctor-123" };
            mockRequest.user = {
                id: "doctor-123",
                email: "test@test.com",
                role: "DOCTOR",
            };
            (doctorService.deleteDoctor as jest.Mock).mockResolvedValue(
                undefined
            );

            // Act
            await doctorController.deleteDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.deleteDoctor).toHaveBeenCalledWith(
                "doctor-123"
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message:
                    "Doctor deletion request received and is under review.",
            });
        });

        it("should return 400 when id is missing", async () => {
            // Arrange
            mockRequest.params = {};

            // Act
            await doctorController.deleteDoctor(
                mockRequest as AuthRequest,
                mockResponse as Response
            );

            // Assert
            expect(doctorService.deleteDoctor).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
        });
    });
});

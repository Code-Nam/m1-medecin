import type { Request, Response } from "express";
import { AuthController } from "../../../src/controllers/auth/AuthController";
import { authService } from "../../../src/services/auth/AuthService";

// Mock dependencies
jest.mock("../../../src/services/auth/AuthService", () => ({
    authService: {
        loginPatient: jest.fn(),
        registerPatient: jest.fn(),
        loginDoctor: jest.fn(),
        loginSecretary: jest.fn(),
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

describe("AuthController - Unit Tests", () => {
    let authController: AuthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Initialize controller
        authController = new AuthController();

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
        };
    });

    describe("loginPatient", () => {
        it("should login patient successfully with valid credentials", async () => {
            // Arrange
            const loginData = {
                email: "patient@test.com",
                password: "password123",
            };
            const expectedResult = {
                token: "mock-jwt-token",
                user: {
                    id: "patient-id",
                    email: "patient@test.com",
                    role: "PATIENT",
                },
            };

            mockRequest.body = loginData;
            (authService.loginPatient as jest.Mock).mockResolvedValue(
                expectedResult,
            );

            // Act
            await authController.loginPatient(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.loginPatient).toHaveBeenCalledWith(
                loginData.email,
                loginData.password,
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expectedResult);
        });

        it("should handle invalid credentials error", async () => {
            // Arrange
            const loginData = {
                email: "patient@test.com",
                password: "wrong-password",
            };
            const error = new Error("Invalid credentials");

            mockRequest.body = loginData;
            (authService.loginPatient as jest.Mock).mockRejectedValue(error);

            // Act
            await authController.loginPatient(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.loginPatient).toHaveBeenCalledWith(
                loginData.email,
                loginData.password,
            );
            expect(mockStatus).toHaveBeenCalledWith(500);
        });

        it("should handle missing email", async () => {
            // Arrange
            mockRequest.body = {
                password: "password123",
            };

            // Act
            await authController.loginPatient(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.loginPatient).toHaveBeenCalled();
        });

        it("should handle missing password", async () => {
            // Arrange
            mockRequest.body = {
                email: "patient@test.com",
            };

            // Act
            await authController.loginPatient(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.loginPatient).toHaveBeenCalled();
        });
    });

    describe("registerPatient", () => {
        it("should register new patient successfully", async () => {
            // Arrange
            const patientData = {
                email: "newpatient@test.com",
                password: "password123",
                firstName: "John",
                lastName: "Doe",
                phoneNumber: "1234567890",
                dateOfBirth: "1990-01-01",
            };
            const expectedResult = {
                token: "mock-jwt-token",
                user: {
                    id: "new-patient-id",
                    email: "newpatient@test.com",
                    role: "PATIENT",
                },
            };

            mockRequest.body = patientData;
            (authService.registerPatient as jest.Mock).mockResolvedValue(
                expectedResult,
            );

            // Act
            await authController.registerPatient(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.registerPatient).toHaveBeenCalledWith(
                patientData,
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(expectedResult);
        });

        it("should handle duplicate email error", async () => {
            // Arrange
            const patientData = {
                email: "existing@test.com",
                password: "password123",
                firstName: "John",
                lastName: "Doe",
            };
            const error = new Error("Email already exists");

            mockRequest.body = patientData;
            (authService.registerPatient as jest.Mock).mockRejectedValue(error);

            // Act
            await authController.registerPatient(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.registerPatient).toHaveBeenCalledWith(
                patientData,
            );
            expect(mockStatus).toHaveBeenCalledWith(500);
        });

        it("should handle validation errors", async () => {
            // Arrange
            const invalidData = {
                email: "invalid-email",
                password: "123", // too short
            };
            const error = new Error("Validation failed");

            mockRequest.body = invalidData;
            (authService.registerPatient as jest.Mock).mockRejectedValue(error);

            // Act
            await authController.registerPatient(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("loginDoctor", () => {
        it("should login doctor successfully with valid credentials", async () => {
            // Arrange
            const loginData = {
                email: "doctor@test.com",
                password: "password123",
            };
            const expectedResult = {
                token: "mock-jwt-token",
                user: {
                    id: "doctor-id",
                    email: "doctor@test.com",
                    role: "DOCTOR",
                },
            };

            mockRequest.body = loginData;
            (authService.loginDoctor as jest.Mock).mockResolvedValue(
                expectedResult,
            );

            // Act
            await authController.loginDoctor(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.loginDoctor).toHaveBeenCalledWith(
                loginData.email,
                loginData.password,
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expectedResult);
        });

        it("should handle invalid doctor credentials", async () => {
            // Arrange
            const loginData = {
                email: "doctor@test.com",
                password: "wrong-password",
            };
            const error = new Error("Invalid credentials");

            mockRequest.body = loginData;
            (authService.loginDoctor as jest.Mock).mockRejectedValue(error);

            // Act
            await authController.loginDoctor(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });

    describe("loginSecretary", () => {
        it("should login secretary successfully with valid credentials", async () => {
            // Arrange
            const loginData = {
                email: "secretary@test.com",
                password: "password123",
            };
            const expectedResult = {
                token: "mock-jwt-token",
                user: {
                    id: "secretary-id",
                    email: "secretary@test.com",
                    role: "SECRETARY",
                },
            };

            mockRequest.body = loginData;
            (authService.loginSecretary as jest.Mock).mockResolvedValue(
                expectedResult,
            );

            // Act
            await authController.loginSecretary(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(authService.loginSecretary).toHaveBeenCalledWith(
                loginData.email,
                loginData.password,
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expectedResult);
        });

        it("should handle invalid secretary credentials", async () => {
            // Arrange
            const loginData = {
                email: "secretary@test.com",
                password: "wrong-password",
            };
            const error = new Error("Invalid credentials");

            mockRequest.body = loginData;
            (authService.loginSecretary as jest.Mock).mockRejectedValue(error);

            // Act
            await authController.loginSecretary(
                mockRequest as Request,
                mockResponse as Response,
            );

            // Assert
            expect(mockStatus).toHaveBeenCalledWith(500);
        });
    });
});

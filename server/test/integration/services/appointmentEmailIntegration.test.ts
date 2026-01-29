import { appointmentService } from "../../../src/services/appointment/AppointmentService";
import { emailService } from "../../../src/services/email/EmailService";
import { appointmentRepository } from "../../../src/repositories/appointment/AppointmentRepository";
import { patientRepository } from "../../../src/repositories/patient/PatientRepository";
import { doctorRepository } from "../../../src/repositories/doctor/DoctorRepository";
import { availabilityRepository } from "../../../src/repositories/availability/AvailabilityRepository";

// Mock repositories
jest.mock("../../../src/repositories/appointment/AppointmentRepository");
jest.mock("../../../src/repositories/patient/PatientRepository");
jest.mock("../../../src/repositories/doctor/DoctorRepository");
jest.mock("../../../src/repositories/availability/AvailabilityRepository");

// Mock email service
jest.mock("../../../src/services/email/EmailService");

// Mock logger
jest.mock("../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

describe("AppointmentService - Email Integration Tests", () => {
    const mockPatient = {
        id: "patient-123",
        firstName: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        dateOfBirth: new Date("1990-01-15"),
        address: "123 Main St",
        userId: "user-patient-123",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockDoctor = {
        id: "doctor-456",
        firstName: "Robert",
        surname: "Smith",
        email: "dr.smith@example.com",
        phone: "+1234567800",
        title: "Dr.",
        specialization: "Cardiology",
        openingTime: "09:00",
        closingTime: "17:00",
        slotDuration: 30,
        userId: "user-doctor-456",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockAppointment = {
        id: "appointment-789",
        appointedPatientId: mockPatient.id,
        appointedDoctorId: mockDoctor.id,
        date: new Date("2026-02-15"),
        time: "10:30",
        reason: "Consultation de routine",
        status: "PENDING" as const,
        notes: "Apporter résultats d'analyses",
        availabilitySlotId: "slot-123",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock availability repository to prevent slot generation
        (availabilityRepository.findDoctorById as jest.Mock).mockResolvedValue(
            null
        );
        (
            appointmentRepository.findAvailabilitySlotById as jest.Mock
        ).mockResolvedValue(null);
    });

    describe("createAppointment - Email Integration", () => {
        it("should send reminder email when appointment is created", async () => {
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockResolvedValue(undefined);

            await appointmentService.createAppointment({
                appointedPatientId: mockPatient.id,
                appointedDoctorId: mockDoctor.id,
                date: "2026-02-15",
                time: "10:30",
                reason: "Consultation de routine",
                notes: "Apporter résultats d'analyses",
            });

            expect(emailService.sendAppointmentReminder).toHaveBeenCalledTimes(
                1
            );
            expect(emailService.sendAppointmentReminder).toHaveBeenCalledWith(
                expect.objectContaining({
                    patientName: `${mockPatient.firstName} ${mockPatient.surname}`,
                    patientEmail: mockPatient.email,
                    doctorName: `${mockDoctor.firstName} ${mockDoctor.surname}`,
                    doctorTitle: mockDoctor.title,
                    doctorSpecialization: mockDoctor.specialization,
                    appointmentTime: mockAppointment.time,
                    reason: mockAppointment.reason,
                })
            );
        });

        it("should create appointment even if email sending fails", async () => {
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockRejectedValue(new Error("Email failed"));

            const result = await appointmentService.createAppointment({
                appointedPatientId: mockPatient.id,
                appointedDoctorId: mockDoctor.id,
                date: "15-02-2026",
                time: "10:30",
                reason: "Consultation de routine",
            });

            // Verify the transformed return format
            expect(result).toEqual({
                id: mockAppointment.id,
                appointedPatient: mockPatient.id,
                appointedDoctor: mockDoctor.id,
                date: "15-02-2026",
                time: mockAppointment.time,
                reason: mockAppointment.reason,
                status: mockAppointment.status,
                notes: mockAppointment.notes,
            });
            expect(appointmentRepository.createAppointment).toHaveBeenCalled();
        });

        it("should format date correctly for email", async () => {
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockResolvedValue(undefined);

            await appointmentService.createAppointment({
                appointedPatientId: mockPatient.id,
                appointedDoctorId: mockDoctor.id,
                date: "2026-02-15",
                time: "10:30",
                reason: "Consultation de routine",
            });

            const emailCall = (
                emailService.sendAppointmentReminder as jest.Mock
            ).mock.calls[0][0];
            expect(emailCall.appointmentDate).toMatch(/^\d{2}-\d{2}-\d{4}$/); // DD-MM-YYYY format
        });

        it("should handle null notes field", async () => {
            const appointmentWithoutNotes = { ...mockAppointment, notes: null };
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(appointmentWithoutNotes);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockResolvedValue(undefined);

            await appointmentService.createAppointment({
                appointedPatientId: mockPatient.id,
                appointedDoctorId: mockDoctor.id,
                date: "2026-02-15",
                time: "10:30",
                reason: "Consultation",
            });

            const emailCall = (
                emailService.sendAppointmentReminder as jest.Mock
            ).mock.calls[0][0];
            expect(emailCall.notes).toBeUndefined();
        });
    });

    describe("updateAppointment - Email Integration", () => {
        it("should send recap email when appointment is marked as COMPLETED", async () => {
            const completedAppointment = {
                ...mockAppointment,
                status: "COMPLETED" as const,
                patient: mockPatient,
                doctor: mockDoctor,
            };

            (
                appointmentRepository.findAppointmentById as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.updateAppointment as jest.Mock
            ).mockResolvedValue(completedAppointment);
            (emailService.sendAppointmentRecap as jest.Mock).mockResolvedValue(
                undefined
            );

            await appointmentService.updateAppointment(mockAppointment.id, {
                status: "COMPLETED",
            });

            expect(emailService.sendAppointmentRecap).toHaveBeenCalledTimes(1);
            expect(emailService.sendAppointmentRecap).toHaveBeenCalledWith(
                expect.objectContaining({
                    patientName: `${mockPatient.firstName} ${mockPatient.surname}`,
                    patientEmail: mockPatient.email,
                    doctorName: `${mockDoctor.firstName} ${mockDoctor.surname}`,
                })
            );
        });

        it("should not send recap email when appointment status is not COMPLETED", async () => {
            const pendingAppointment = {
                ...mockAppointment,
                status: "PENDING" as const,
            };
            (
                appointmentRepository.findAppointmentById as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.updateAppointment as jest.Mock
            ).mockResolvedValue(pendingAppointment);

            await appointmentService.updateAppointment(mockAppointment.id, {
                notes: "Updated notes",
            });

            expect(emailService.sendAppointmentRecap).not.toHaveBeenCalled();
        });

        it("should not send recap email when status changes to CANCELLED", async () => {
            const cancelledAppointment = {
                ...mockAppointment,
                status: "CANCELLED" as const,
            };
            (
                appointmentRepository.findAppointmentById as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.updateAppointment as jest.Mock
            ).mockResolvedValue(cancelledAppointment);

            await appointmentService.updateAppointment(mockAppointment.id, {
                status: "CANCELLED",
            });

            expect(emailService.sendAppointmentRecap).not.toHaveBeenCalled();
        });

        it("should update appointment even if recap email fails", async () => {
            const completedAppointment = {
                ...mockAppointment,
                status: "COMPLETED" as const,
                patient: mockPatient,
                doctor: mockDoctor,
            };
            (
                appointmentRepository.findAppointmentById as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.updateAppointment as jest.Mock
            ).mockResolvedValue(completedAppointment);
            (emailService.sendAppointmentRecap as jest.Mock).mockRejectedValue(
                new Error("Email failed")
            );

            const result = await appointmentService.updateAppointment(
                mockAppointment.id,
                {
                    status: "COMPLETED",
                }
            );

            // Verify the transformed return format
            expect(result).toEqual({
                id: completedAppointment.id,
                appointedPatient: completedAppointment.appointedPatientId,
                appointedDoctor: completedAppointment.appointedDoctorId,
                date: "15-02-2026",
                time: completedAppointment.time,
                reason: completedAppointment.reason,
                status: "COMPLETED",
                notes: completedAppointment.notes,
            });
            expect(appointmentRepository.updateAppointment).toHaveBeenCalled();
        });

        it("should send recap email with undefined for null fields", async () => {
            const doctorWithoutOptionalFields = {
                ...mockDoctor,
                title: null,
                specialization: null,
            };
            const completedAppointment = {
                ...mockAppointment,
                status: "COMPLETED" as const,
            };

            (
                appointmentRepository.findAppointmentById as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                doctorWithoutOptionalFields
            );
            (
                appointmentRepository.updateAppointment as jest.Mock
            ).mockResolvedValue(completedAppointment);
            (emailService.sendAppointmentRecap as jest.Mock).mockResolvedValue(
                undefined
            );

            await appointmentService.updateAppointment(mockAppointment.id, {
                status: "COMPLETED",
            });

            const emailCall = (emailService.sendAppointmentRecap as jest.Mock)
                .mock.calls[0][0];
            expect(emailCall.doctorTitle).toBeUndefined();
            expect(emailCall.doctorSpecialization).toBeUndefined();
        });

        it("should handle COMPLETED status with additional updates", async () => {
            const completedAppointment = {
                ...mockAppointment,
                status: "COMPLETED" as const,
                notes: "Updated consultation notes",
            };

            (
                appointmentRepository.findAppointmentById as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.updateAppointment as jest.Mock
            ).mockResolvedValue(completedAppointment);
            (emailService.sendAppointmentRecap as jest.Mock).mockResolvedValue(
                undefined
            );

            await appointmentService.updateAppointment(mockAppointment.id, {
                status: "COMPLETED",
                notes: "Updated consultation notes",
            });

            expect(emailService.sendAppointmentRecap).toHaveBeenCalledTimes(1);
            const emailCall = (emailService.sendAppointmentRecap as jest.Mock)
                .mock.calls[0][0];
            expect(emailCall.notes).toBe("Updated consultation notes");
        });
    });

    describe("Email Integration - Edge Cases", () => {
        it("should handle appointment creation without slot", async () => {
            const appointmentWithoutSlot = {
                ...mockAppointment,
                availabilitySlotId: null,
            };
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(appointmentWithoutSlot);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockResolvedValue(undefined);

            await appointmentService.createAppointment({
                appointedPatientId: mockPatient.id,
                appointedDoctorId: mockDoctor.id,
                date: "2026-02-15",
                time: "10:30",
                reason: "Emergency",
            });

            expect(emailService.sendAppointmentReminder).toHaveBeenCalledTimes(
                1
            );
        });

        it("should handle very long patient/doctor names", async () => {
            const longNamePatient = {
                ...mockPatient,
                firstName: "A".repeat(100),
                surname: "B".repeat(100),
            };
            const longNameDoctor = {
                ...mockDoctor,
                firstName: "C".repeat(100),
                surname: "D".repeat(100),
            };

            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                longNamePatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                longNameDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockResolvedValue(undefined);

            await appointmentService.createAppointment({
                appointedPatientId: longNamePatient.id,
                appointedDoctorId: longNameDoctor.id,
                date: "2026-02-15",
                time: "10:30",
                reason: "Consultation",
            });

            expect(emailService.sendAppointmentReminder).toHaveBeenCalledTimes(
                1
            );
        });

        it("should handle special characters in appointment data", async () => {
            const specialCharsAppointment = {
                ...mockAppointment,
                reason: 'Consultation <spéciale> avec "accents" & caractères',
                notes: "Notes avec émojis 🏥 et symboles €$£",
            };

            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(specialCharsAppointment);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockResolvedValue(undefined);

            await appointmentService.createAppointment({
                appointedPatientId: mockPatient.id,
                appointedDoctorId: mockDoctor.id,
                date: "2026-02-15",
                time: "10:30",
                reason: specialCharsAppointment.reason,
                notes: specialCharsAppointment.notes,
            });

            expect(emailService.sendAppointmentReminder).toHaveBeenCalledTimes(
                1
            );
            const emailCall = (
                emailService.sendAppointmentReminder as jest.Mock
            ).mock.calls[0][0];
            expect(emailCall.reason).toContain("spéciale");
            expect(emailCall.notes).toContain("🏥");
        });

        it("should handle concurrent email sending", async () => {
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockResolvedValue(undefined);

            // Create multiple appointments concurrently
            const promises = Array.from({ length: 5 }, () =>
                appointmentService.createAppointment({
                    appointedPatientId: mockPatient.id,
                    appointedDoctorId: mockDoctor.id,
                    date: "2026-02-15",
                    time: "10:30",
                    reason: "Consultation",
                })
            );

            await Promise.all(promises);

            expect(emailService.sendAppointmentReminder).toHaveBeenCalledTimes(
                5
            );
        });
    });

    describe("Email Service Independence", () => {
        it("appointment creation should succeed independently of email service", async () => {
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.createAppointment as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (
                emailService.sendAppointmentReminder as jest.Mock
            ).mockRejectedValue(new Error("Resend API is down"));

            const result = await appointmentService.createAppointment({
                appointedPatientId: mockPatient.id,
                appointedDoctorId: mockDoctor.id,
                date: "2026-02-15",
                time: "10:30",
                reason: "Consultation",
            });

            expect(result).toBeDefined();
            expect(result.id).toBe(mockAppointment.id);
        });

        it("appointment update should succeed independently of email service", async () => {
            const completedAppointment = {
                ...mockAppointment,
                status: "COMPLETED" as const,
            };
            (
                appointmentRepository.findAppointmentById as jest.Mock
            ).mockResolvedValue(mockAppointment);
            (patientRepository.findPatientById as jest.Mock).mockResolvedValue(
                mockPatient
            );
            (doctorRepository.findDoctorById as jest.Mock).mockResolvedValue(
                mockDoctor
            );
            (
                appointmentRepository.updateAppointment as jest.Mock
            ).mockResolvedValue(completedAppointment);
            (emailService.sendAppointmentRecap as jest.Mock).mockRejectedValue(
                new Error("Email service unavailable")
            );

            const result = await appointmentService.updateAppointment(
                mockAppointment.id,
                {
                    status: "COMPLETED",
                }
            );

            expect(result).toBeDefined();
            expect(result.status).toBe("COMPLETED");
        });
    });
});

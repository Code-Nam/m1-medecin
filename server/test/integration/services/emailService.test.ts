// Mock logger BEFORE importing any modules
jest.mock("../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

// Mock Resend
const mockResendSend = jest.fn();
jest.mock("resend", () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: mockResendSend,
        },
    })),
}));

import { EmailService } from "../../../src/services/email/EmailService";
import type { AppointmentEmailData } from "../../../src/services/email/IEmailService";
import { logger } from "../../../src/config/logger";

describe("EmailService - Integration Tests", () => {
    let emailService: EmailService;

    const mockAppointmentData: AppointmentEmailData = {
        patientName: "John Doe",
        patientEmail: "john.doe@example.com",
        doctorName: "Robert Smith",
        doctorTitle: "Dr.",
        doctorSpecialization: "Cardiology",
        appointmentDate: "15-02-2026",
        appointmentTime: "10:30",
        reason: "Consultation de routine",
        notes: "Apporter résultats d'analyses",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        emailService = new EmailService();
        mockResendSend.mockResolvedValue({
            data: { id: "email-123" },
            error: null,
        });
    });

    describe("sendAppointmentReminder", () => {
        it("should send reminder email successfully", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);

            expect(mockResendSend).toHaveBeenCalledTimes(1);
            expect(mockResendSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: expect.any(String),
                    to: mockAppointmentData.patientEmail,
                    subject: expect.stringContaining("Rappel"),
                    html: expect.any(String),
                    text: expect.any(String),
                })
            );
        });

        it("should include all appointment details in email", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];

            // Check HTML content
            expect(callArgs.html).toContain(mockAppointmentData.patientName);
            expect(callArgs.html).toContain(mockAppointmentData.doctorName);
            expect(callArgs.html).toContain(mockAppointmentData.doctorTitle);
            expect(callArgs.html).toContain(
                mockAppointmentData.appointmentDate
            );
            expect(callArgs.html).toContain(
                mockAppointmentData.appointmentTime
            );
            expect(callArgs.html).toContain(mockAppointmentData.reason);

            // Check text content
            expect(callArgs.text).toContain(mockAppointmentData.patientName);
            expect(callArgs.text).toContain(mockAppointmentData.doctorName);
        });

        it("should handle reminder email without optional fields", async () => {
            const minimalData: AppointmentEmailData = {
                patientName: "Jane Smith",
                patientEmail: "jane.smith@example.com",
                doctorName: "Emily Johnson",
                appointmentDate: "20-02-2026",
                appointmentTime: "14:00",
                reason: "First consultation",
            };

            await emailService.sendAppointmentReminder(minimalData);

            expect(mockResendSend).toHaveBeenCalledTimes(1);
            const callArgs = mockResendSend.mock.calls[0][0];

            expect(callArgs.html).toContain(minimalData.patientName);
            expect(callArgs.html).toContain(minimalData.doctorName);
        });

        it("should not throw error when email sending fails", async () => {
            mockResendSend.mockRejectedValue(new Error("API Error"));

            // Should not throw - service handles errors internally
            await emailService.sendAppointmentReminder(mockAppointmentData);

            expect(true).toBe(true);
        });

        it("should log error when email sending fails", async () => {
            const error = new Error("Resend API Error");
            mockResendSend.mockRejectedValue(error);

            await emailService.sendAppointmentReminder(mockAppointmentData);

            expect(mockLogger.error).toHaveBeenCalled();
        });

        it("should use correct email subject format", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];
            expect(callArgs.subject).toContain("Rappel");
            expect(callArgs.subject).toContain(mockAppointmentData.doctorName);
        });

        it("should handle doctor without title", async () => {
            const dataWithoutTitle: AppointmentEmailData = {
                ...mockAppointmentData,
                doctorTitle: undefined,
            };

            await emailService.sendAppointmentReminder(dataWithoutTitle);

            const callArgs = mockResendSend.mock.calls[0][0];
            expect(callArgs.subject).toContain("Dr");
        });

        it("should generate valid HTML structure", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];
            const html = callArgs.html;

            // Check for valid HTML structure
            expect(html).toContain("<!DOCTYPE html>");
            expect(html).toContain('<html lang="fr">');
            expect(html).toContain("</html>");
            expect(html).toContain("<body>");
            expect(html).toContain("</body>");
        });

        it("should include French content", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];

            // Check for French phrases
            expect(callArgs.html).toContain("Bonjour");
            expect(callArgs.html).toContain("Rappel de Rendez-vous");
            expect(callArgs.html).toContain("Date");
            expect(callArgs.html).toContain("Heure");
            expect(callArgs.html).toContain("Praticien");
        });
    });

    describe("sendAppointmentRecap", () => {
        it("should send recap email successfully", async () => {
            await emailService.sendAppointmentRecap(mockAppointmentData);

            expect(mockResendSend).toHaveBeenCalledTimes(1);
            expect(mockResendSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    from: expect.any(String),
                    to: mockAppointmentData.patientEmail,
                    subject: expect.stringContaining("Récapitulatif"),
                    html: expect.any(String),
                    text: expect.any(String),
                })
            );
        });

        it("should include all appointment details in recap email", async () => {
            await emailService.sendAppointmentRecap(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];

            // Check HTML content
            expect(callArgs.html).toContain(mockAppointmentData.patientName);
            expect(callArgs.html).toContain(mockAppointmentData.doctorName);
            expect(callArgs.html).toContain(mockAppointmentData.doctorTitle);
            expect(callArgs.html).toContain(
                mockAppointmentData.appointmentDate
            );
            expect(callArgs.html).toContain(
                mockAppointmentData.appointmentTime
            );

            // Check text content
            expect(callArgs.text).toContain(mockAppointmentData.patientName);
            expect(callArgs.text).toContain(mockAppointmentData.doctorName);
        });

        it("should handle recap email without optional fields", async () => {
            const minimalData: AppointmentEmailData = {
                patientName: "Jane Smith",
                patientEmail: "jane.smith@example.com",
                doctorName: "Emily Johnson",
                appointmentDate: "20-02-2026",
                appointmentTime: "14:00",
                reason: "Follow-up consultation",
            };

            await emailService.sendAppointmentRecap(minimalData);

            expect(mockResendSend).toHaveBeenCalledTimes(1);
            const callArgs = mockResendSend.mock.calls[0][0];

            expect(callArgs.html).toContain(minimalData.patientName);
            expect(callArgs.html).toContain(minimalData.doctorName);
        });

        it("should not throw error when recap email sending fails", async () => {
            mockResendSend.mockRejectedValue(new Error("API Error"));

            // Should not throw - service handles errors internally
            await emailService.sendAppointmentRecap(mockAppointmentData);

            expect(true).toBe(true);
        });

        it("should log error when recap email sending fails", async () => {
            const error = new Error("Resend API Error");
            mockResendSend.mockRejectedValue(error);

            await emailService.sendAppointmentRecap(mockAppointmentData);

            expect(mockLogger.error).toHaveBeenCalled();
        });

        it("should use correct recap email subject format", async () => {
            await emailService.sendAppointmentRecap(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];
            expect(callArgs.subject).toContain("Récapitulatif");
            expect(callArgs.subject).toContain(mockAppointmentData.doctorName);
        });

        it("should generate valid HTML structure for recap", async () => {
            await emailService.sendAppointmentRecap(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];
            const html = callArgs.html;

            // Check for valid HTML structure
            expect(html).toContain("<!DOCTYPE html>");
            expect(html).toContain('<html lang="fr">');
            expect(html).toContain("</html>");
            expect(html).toContain("<body>");
            expect(html).toContain("</body>");
        });

        it("should include French recap content", async () => {
            await emailService.sendAppointmentRecap(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];

            // Check for French phrases specific to recap
            expect(callArgs.html).toContain("Récapitulatif");
            expect(callArgs.html).toContain("Prochaines étapes");
        });

        it("should include next steps section in recap", async () => {
            await emailService.sendAppointmentRecap(mockAppointmentData);

            const callArgs = mockResendSend.mock.calls[0][0];

            // Check for next steps content
            expect(callArgs.html).toContain("recommandations");
        });
    });

    describe("Email Templates Consistency", () => {
        it("reminder and recap emails should have different subjects", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);
            const reminderSubject = mockResendSend.mock.calls[0][0].subject;

            mockResendSend.mockClear();

            await emailService.sendAppointmentRecap(mockAppointmentData);
            const recapSubject = mockResendSend.mock.calls[0][0].subject;

            expect(reminderSubject).not.toBe(recapSubject);
            expect(reminderSubject).toContain("Rappel");
            expect(recapSubject).toContain("Récapitulatif");
        });

        it("both email types should send to correct patient email", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);
            expect(mockResendSend.mock.calls[0][0].to).toBe(
                mockAppointmentData.patientEmail
            );

            mockResendSend.mockClear();

            await emailService.sendAppointmentRecap(mockAppointmentData);
            expect(mockResendSend.mock.calls[0][0].to).toBe(
                mockAppointmentData.patientEmail
            );
        });

        it("both email types should have HTML and text versions", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);
            expect(mockResendSend).toHaveBeenCalledTimes(1);
            expect(mockResendSend.mock.calls[0][0].html).toBeDefined();
            expect(mockResendSend.mock.calls[0][0].text).toBeDefined();

            mockResendSend.mockClear();

            await emailService.sendAppointmentRecap(mockAppointmentData);
            expect(mockResendSend).toHaveBeenCalledTimes(1);
            expect(mockResendSend.mock.calls[0][0].html).toBeDefined();
            expect(mockResendSend.mock.calls[0][0].text).toBeDefined();
        });
    });

    describe("Error Handling", () => {
        it("should handle network errors gracefully", async () => {
            mockResendSend.mockRejectedValue(new Error("Network timeout"));

            // Should not throw - service handles errors internally
            await emailService.sendAppointmentReminder(mockAppointmentData);
            await emailService.sendAppointmentRecap(mockAppointmentData);

            expect(true).toBe(true);
        });

        it("should handle API rate limit errors", async () => {
            mockResendSend.mockRejectedValue(new Error("Rate limit exceeded"));

            // Should not throw - service handles errors internally
            await emailService.sendAppointmentReminder(mockAppointmentData);

            expect(true).toBe(true);
        });

        it("should handle invalid email addresses", async () => {
            mockResendSend.mockRejectedValue(
                new Error("Invalid email address")
            );

            const invalidData = {
                ...mockAppointmentData,
                patientEmail: "invalid-email",
            };

            // Should not throw - service handles errors internally
            await emailService.sendAppointmentReminder(invalidData);

            expect(true).toBe(true);
        });
    });

    describe("Logging", () => {
        it("should log successful reminder email sending", async () => {
            await emailService.sendAppointmentReminder(mockAppointmentData);

            expect(mockLogger.info).toHaveBeenCalled();
        });

        it("should log successful recap email sending", async () => {
            await emailService.sendAppointmentRecap(mockAppointmentData);

            expect(mockLogger.info).toHaveBeenCalled();
        });

        it("should log email ID on successful send", async () => {
            mockResendSend.mockResolvedValue({
                data: { id: "test-email-id-123" },
                error: null,
            });

            await emailService.sendAppointmentReminder(mockAppointmentData);

            expect(mockLogger.info).toHaveBeenCalled();
        });
    });
});

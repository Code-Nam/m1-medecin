import { parseDate } from "../../utils/dateFormatter";
import { logger } from "../../config/logger";
import { appointmentRepository } from "../../repositories/appointment/AppointmentRepository";
import { patientRepository } from "../../repositories/patient/PatientRepository";
import { doctorRepository } from "../../repositories/doctor/DoctorRepository";
import { emailService } from "../email/EmailService";
import type { IAppointmentService } from "./IAppointmentService";

export class AppointmentService implements IAppointmentService {
    async getAppointmentsByPatient(
        patientId: string,
        page: number = 1,
        pageSize: number = 10
    ) {
        const { appointments, total } =
            await appointmentRepository.findAppointmentsByPatient(
                patientId,
                page,
                pageSize
            );

        return {
            appointments: (appointments as any[]).map((apt: any) => ({
                id: apt.id,
                appointedPatient: apt.appointedPatientId,
                appointedDoctor: apt.appointedDoctorId,
                date: this.formatDateForResponse(apt.date),
                time: apt.time,
                reason: apt.reason,
                status: apt.status,
                notes: apt.notes,
                doctor: apt.doctor,
            })),
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            totalAppointments: total,
        };
    }

    async getAppointmentsByDoctor(
        doctorId: string,
        page: number = 1,
        pageSize: number = 10
    ) {
        const { appointments, total } =
            await appointmentRepository.findAppointmentsByDoctor(
                doctorId,
                page,
                pageSize
            );

        return {
            appointments: (appointments as any[]).map((apt: any) => ({
                id: apt.id,
                appointedPatient: apt.appointedPatientId,
                appointedDoctor: apt.appointedDoctorId,
                date: this.formatDateForResponse(apt.date),
                time: apt.time,
                reason: apt.reason,
                status: apt.status,
                notes: apt.notes,
                patient: apt.patient,
            })),
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
            totalAppointments: total,
        };
    }

    async createAppointment(data: any) {
        const patientId = data.appointedPatientId || data.appointedPatient;
        const doctorId = data.appointedDoctorId || data.appointedDoctor;
        const patient = await patientRepository.findPatientById(patientId);
        if (!patient) throw new Error("Patient not found");
        const doctor = await doctorRepository.findDoctorById(doctorId);
        if (!doctor) throw new Error("Doctor not found");

        const appointmentDate = parseDate(data.date);

        let slotId: string | undefined = undefined;

        if (data.slotId) {
            const slot = await appointmentRepository.findAvailabilitySlotById(
                data.slotId as string
            );
            if (!slot) throw new Error("Availability slot not found");
            if (slot.isBooked || !slot.isAvailable)
                throw new Error("This time slot is not available");
            if (slot.doctorId !== doctor.id)
                throw new Error("Slot does not belong to this doctor");
            await appointmentRepository.updateAvailabilitySlot(slot.id, {
                isBooked: true,
                isAvailable: false,
            });
            slotId = slot.id;
        } else {
            const dateStart = new Date(appointmentDate);
            dateStart.setHours(0, 0, 0, 0);
            const dateEnd = new Date(appointmentDate);
            dateEnd.setHours(23, 59, 59, 999);

            const timeParts = data.time
                .replace(/[APM]/gi, "")
                .trim()
                .split(":");
            const hour = parseInt(timeParts[0] || "0");
            const minute = parseInt(timeParts[1] || "0");
            const normalizedTime = `${String(hour).padStart(2, "0")}:${String(
                minute
            ).padStart(2, "0")}`;

            let slot =
                await appointmentRepository.findAvailabilitySlotForDoctorAtTime(
                    doctor.id,
                    dateStart,
                    dateEnd,
                    normalizedTime
                );

            if (!slot) {
                const { availabilityService } = await import(
                    "../availability/AvailabilityService"
                );
                await availabilityService.generateSlotsForDoctor(
                    doctor.id,
                    dateStart,
                    dateEnd
                );
                slot =
                    await appointmentRepository.findAvailabilitySlotForDoctorAtTime(
                        doctor.id,
                        dateStart,
                        dateEnd,
                        normalizedTime
                    );
            }

            if (slot) {
                await appointmentRepository.updateAvailabilitySlot(slot.id, {
                    isBooked: true,
                    isAvailable: false,
                });
                slotId = slot.id;
            }
        }

        const status =
            data.status === "DOCTOR_CREATED" || slotId
                ? "DOCTOR_CREATED"
                : "PENDING";

        const appointment = await appointmentRepository.createAppointment({
            appointedPatientId: patient.id,
            appointedDoctorId: doctor.id,
            availabilitySlotId: slotId,
            date: appointmentDate,
            time: data.time,
            reason: data.reason,
            notes: data.notes,
            status: status as any,
        });

        logger.info(`Appointment created: ${appointment.id}`);

        // Send appointment reminder email (non-blocking)
        try {
            await emailService.sendAppointmentReminder({
                patientName: `${patient.firstName} ${patient.surname}`,
                patientEmail: patient.email,
                doctorName: `${doctor.firstName} ${doctor.surname}`,
                doctorTitle: doctor.title ?? undefined,
                doctorSpecialization: doctor.specialization ?? undefined,
                appointmentDate: this.formatDateForResponse(appointment.date),
                appointmentTime: appointment.time,
                reason: appointment.reason,
                notes: appointment.notes ?? undefined,
            });
        } catch (error) {
            // Email sending failed but don't fail the appointment creation
            logger.error(
                `Failed to send reminder email for appointment ${appointment.id}: ${error}`
            );
        }

        return {
            id: appointment.id,
            appointedPatient: patient.id,
            appointedDoctor: doctor.id,
            date: this.formatDateForResponse(appointment.date),
            time: appointment.time,
            reason: appointment.reason,
            status: appointment.status,
            notes: appointment.notes,
        };
    }

    async updateAppointment(id: string, data: any) {
        const appointment = await appointmentRepository.findAppointmentById(id);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        const updateData: any = {};

        if (data.status === "CANCELLED" && appointment.availabilitySlotId) {
            await appointmentRepository.updateAvailabilitySlot(
                appointment.availabilitySlotId,
                { isBooked: false, isAvailable: true }
            );
        }

        if (data.slotId && data.slotId !== appointment.availabilitySlotId) {
            if (appointment.availabilitySlotId) {
                await appointmentRepository.updateAvailabilitySlot(
                    appointment.availabilitySlotId,
                    { isBooked: false, isAvailable: true }
                );
            }

            const newSlot =
                await appointmentRepository.findAvailabilitySlotById(
                    data.slotId as string
                );
            if (!newSlot) throw new Error("Availability slot not found");
            if (newSlot.isBooked || !newSlot.isAvailable)
                throw new Error("This time slot is not available");
            await appointmentRepository.updateAvailabilitySlot(newSlot.id, {
                isBooked: true,
                isAvailable: false,
            });
            updateData.availabilitySlotId = newSlot.id;
        }

        if (data.date) {
            updateData.date = parseDate(data.date);
        }
        if (data.time) updateData.time = data.time;
        if (data.reason) updateData.reason = data.reason;
        if (data.status) {
            updateData.status = data.status as any;
        }
        if (data.notes !== undefined) updateData.notes = data.notes;

        const updatedAppointment =
            await appointmentRepository.updateAppointment(id, updateData);

        logger.info(`Appointment updated: ${id}`);

        // Send recap email when appointment is marked as COMPLETED (non-blocking)
        if (data.status === "COMPLETED") {
            try {
                const patient = updatedAppointment.patient;
                const doctor = updatedAppointment.doctor;

                await emailService.sendAppointmentRecap({
                    patientName: `${patient.firstName} ${patient.surname}`,
                    patientEmail: patient.email,
                    doctorName: `${doctor.firstName} ${doctor.surname}`,
                    doctorTitle: doctor.title ?? undefined,
                    doctorSpecialization: doctor.specialization ?? undefined,
                    appointmentDate: this.formatDateForResponse(
                        updatedAppointment.date
                    ),
                    appointmentTime: updatedAppointment.time,
                    reason: updatedAppointment.reason,
                    notes: updatedAppointment.notes ?? undefined,
                });
            } catch (error) {
                // Email sending failed but don't fail the appointment update
                logger.error(
                    `Failed to send recap email for appointment ${id}: ${error}`
                );
            }
        }

        return {
            id: updatedAppointment.id,
            appointedPatient: updatedAppointment.appointedPatientId,
            appointedDoctor: updatedAppointment.appointedDoctorId,
            date: this.formatDateForResponse(updatedAppointment.date),
            time: updatedAppointment.time,
            reason: updatedAppointment.reason,
            status: updatedAppointment.status,
            notes: updatedAppointment.notes,
        };
    }

    async deleteAppointment(id: string) {
        const appointment = await appointmentRepository.findAppointmentById(id);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.availabilitySlotId)
            await appointmentRepository.updateAvailabilitySlot(
                appointment.availabilitySlotId,
                { isBooked: false, isAvailable: true }
            );
        await appointmentRepository.deleteAppointmentById(id);
        logger.info(`Appointment deleted: ${id}`);
    }

    async getAppointmentById(id: string) {
        const appointment = await appointmentRepository.findAppointmentById(id);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        return {
            id: appointment.id,
            appointedPatient: appointment.patient.id,
            appointedDoctor: appointment.doctor.id,
            date: this.formatDateForResponse(appointment.date),
            time: appointment.time,
            reason: appointment.reason,
            status: appointment.status,
            notes: appointment.notes,
            patient: appointment.patient,
            doctor: appointment.doctor,
        };
    }

    private formatDateForResponse(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
}

export const appointmentService = new AppointmentService();

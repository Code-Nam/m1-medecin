import prisma from '../config/database';
import { parseDate } from '../utils/dateFormatter';
import { logger } from '../config/logger';

export class AppointmentService {
  async getAppointmentsByPatient(patientId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { appointedPatientId: patientId },
        skip,
        take: pageSize,
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              specialization: true,
            },
          },
        },
        orderBy: [
          { date: 'desc' },
          { time: 'desc' },
        ],
      }),
      prisma.appointment.count({
        where: { appointedPatientId: patientId },
      }),
    ]);

    return {
      appointments: appointments.map(apt => ({
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

  async getAppointmentsByDoctor(doctorId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { appointedDoctorId: doctorId },
        skip,
        take: pageSize,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              surname: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' },
        ],
      }),
      prisma.appointment.count({
        where: { appointedDoctorId: doctorId },
      }),
    ]);

    return {
      appointments: appointments.map(apt => ({
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

  async createAppointment(data: {
    appointedPatient: string;
    appointedPatientId?: string;
    appointedDoctor: string;
    appointedDoctorId?: string;
    date: string;
    time: string;
    reason: string;
    notes?: string;
    slotId?: string;
    status?: string;
  }) {
    const patientId = data.appointedPatientId || data.appointedPatient;
    const doctorId = data.appointedDoctorId || data.appointedDoctor;
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const appointmentDate = parseDate(data.date);

    let slotId: string | undefined = undefined;
    
    if (data.slotId) {
      const slot = await prisma.availabilitySlot.findUnique({
        where: { id: data.slotId },
      });

      if (!slot) {
        throw new Error('Availability slot not found');
      }

      if (slot.isBooked || !slot.isAvailable) {
        throw new Error('This time slot is not available');
      }

      if (slot.doctorId !== doctor.id) {
        throw new Error('Slot does not belong to this doctor');
      }

      await prisma.availabilitySlot.update({
        where: { id: data.slotId },
        data: {
          isBooked: true,
          isAvailable: false,
        },
      });

      slotId = slot.id;
    } else {
      const dateStart = new Date(appointmentDate);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(appointmentDate);
      dateEnd.setHours(23, 59, 59, 999);

      const timeParts = data.time.replace(/[APM]/gi, '').trim().split(':');
      const hour = parseInt(timeParts[0]);
      const minute = parseInt(timeParts[1] || '0');
      const normalizedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      let slot = await prisma.availabilitySlot.findFirst({
        where: {
          doctorId: doctor.id,
          date: {
            gte: dateStart,
            lte: dateEnd,
          },
          startTime: normalizedTime,
          isAvailable: true,
          isBooked: false,
        },
      });

      if (!slot) {
        const { availabilityService } = await import('./availability-service');
        await availabilityService.generateSlotsForDoctor(doctor.id, dateStart, dateEnd);
        
        slot = await prisma.availabilitySlot.findFirst({
          where: {
            doctorId: doctor.id,
            date: {
              gte: dateStart,
              lte: dateEnd,
            },
            startTime: normalizedTime,
            isAvailable: true,
            isBooked: false,
          },
        });
      }

      if (slot) {
        await prisma.availabilitySlot.update({
          where: { id: slot.id },
          data: {
            isBooked: true,
            isAvailable: false,
          },
        });
        slotId = slot.id;
      }
    }

    const status = data.status === 'DOCTOR_CREATED' || slotId ? 'DOCTOR_CREATED' : 'PENDING';

    const appointment = await prisma.appointment.create({
      data: {
        appointedPatientId: patient.id,
        appointedDoctorId: doctor.id,
        availabilitySlotId: slotId,
        date: appointmentDate,
        time: data.time,
        reason: data.reason,
        notes: data.notes,
        status: status as any,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            surname: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            specialization: true,
          },
        },
      },
    });

    logger.info(`Appointment created: ${appointment.id}`);
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

  async updateAppointment(id: string, data: {
    date?: string;
    time?: string;
    reason?: string;
    status?: string;
    notes?: string;
    slotId?: string;
  }) {
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId },
      include: { availabilitySlot: true },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const updateData: any = {};

    if (data.status === 'CANCELLED' && appointment.availabilitySlotId) {
      await prisma.availabilitySlot.update({
        where: { id: appointment.availabilitySlotId },
        data: {
          isBooked: false,
          isAvailable: true,
        },
      });
    }

    if (data.slotId && data.slotId !== appointment.availabilitySlotId) {
      if (appointment.availabilitySlotId) {
        await prisma.availabilitySlot.update({
          where: { id: appointment.availabilitySlotId },
          data: {
            isBooked: false,
            isAvailable: true,
          },
        });
      }

      const newSlot = await prisma.availabilitySlot.findUnique({
        where: { id: data.slotId },
      });

      if (!newSlot) {
        throw new Error('Availability slot not found');
      }

      if (newSlot.isBooked || !newSlot.isAvailable) {
        throw new Error('This time slot is not available');
      }

      await prisma.availabilitySlot.update({
        where: { id: data.slotId },
        data: {
          isBooked: true,
          isAvailable: false,
        },
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

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            surname: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            surname: true,
          },
        },
      },
    });

    logger.info(`Appointment updated: ${id}`);
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
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { availabilitySlot: true },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.availabilitySlotId) {
      await prisma.availabilitySlot.update({
        where: { id: appointment.availabilitySlotId },
        data: {
          isBooked: false,
          isAvailable: true,
        },
      });
    }

    await prisma.appointment.delete({
      where: { id },
    });
    logger.info(`Appointment deleted: ${id}`);
  }

  async getAppointmentById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            specialization: true,
            title: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

export const appointmentService = new AppointmentService();


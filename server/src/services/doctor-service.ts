import prisma from '../config/database';
import { hashPassword, generateDefaultPassword } from '../utils/password';
import { logger } from '../config/logger';

export class DoctorService {
  async getDoctor(id: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
        phone: true,
        title: true,
        specialization: true,
        openingTime: true,
        closingTime: true,
        slotDuration: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            patients: true,
            appointments: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    return doctor;
  }

  async getDoctors(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        skip,
        take: pageSize,
        select: {
          id: true,
          firstName: true,
          surname: true,
          email: true,
          phone: true,
          title: true,
          specialization: true,
          openingTime: true,
          closingTime: true,
          slotDuration: true,
          _count: {
            select: {
              patients: true,
              appointments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.doctor.count(),
    ]);

    return {
      doctors,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      total,
    };
  }

  async getAllDoctors() {
    const doctors = await prisma.doctor.findMany({
        select: {
          id: true,
          firstName: true,
          surname: true,
          email: true,
          phone: true,
          title: true,
          specialization: true,
          openingTime: true,
          closingTime: true,
          slotDuration: true,
        },
      orderBy: { surname: 'asc' },
    });

    return doctors;
  }

  async createDoctor(data: {
    firstName: string;
    surname: string;
    email: string;
    password?: string;
    phone?: string;
    title?: string;
    specialization: string;
    openingTime?: string;
    closingTime?: string;
    slotDuration?: number;
  }) {
    const password = data.password || generateDefaultPassword();
    const hashedPassword = await hashPassword(password);

    const doctor = await prisma.doctor.create({
      data: {
        firstName: data.firstName,
        surname: data.surname,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        title: data.title || 'Dr.',
        specialization: data.specialization,
        openingTime: data.openingTime || '09:00',
        closingTime: data.closingTime || '17:00',
        slotDuration: data.slotDuration || 30,
      },
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
        phone: true,
        title: true,
        specialization: true,
        openingTime: true,
        closingTime: true,
        slotDuration: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`Doctor created: ${doctor.id}`);
    return doctor;
  }

  async updateDoctor(id: string, data: {
    firstName?: string;
    surname?: string;
    email?: string;
    password?: string;
    phone?: string;
    title?: string;
    specialization?: string;
    openingTime?: string;
    closingTime?: string;
    slotDuration?: number;
  }) {
    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.surname) updateData.surname = data.surname;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.specialization) updateData.specialization = data.specialization;
    if (data.openingTime) updateData.openingTime = data.openingTime;
    if (data.closingTime) updateData.closingTime = data.closingTime;
    if (data.slotDuration !== undefined) updateData.slotDuration = data.slotDuration;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        surname: true,
        email: true,
        phone: true,
        title: true,
        specialization: true,
        openingTime: true,
        closingTime: true,
        slotDuration: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`Doctor updated: ${id}`);
    return doctor;
  }

  async deleteDoctor(id: string) {
    await prisma.doctor.delete({
      where: { id },
    });
    logger.info(`Doctor deleted: ${doctorId}`);
  }

  async getPatientsByDoctor(doctorId: string, page: number = 1, pageSize: number = 10) {
    const doctor = await prisma.doctor.findUnique({
      where: { doctorId },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const skip = (page - 1) * pageSize;

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where: { assignedDoctorId: doctor.id },
        skip,
        take: pageSize,
        select: {
          patientId: true,
          firstName: true,
          surname: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          address: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({
        where: { assignedDoctorId: doctor.id },
      }),
    ]);

    return {
      patients,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      total,
    };
  }
}

export const doctorService = new DoctorService();

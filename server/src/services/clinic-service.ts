import prisma from '../config/database';
import { logger } from '../config/logger';

export class ClinicService {
  async getClinic(clinicId: string) {
    const clinic = await prisma.clinic.findUnique({
      where: { clinicId },
      include: {
        doctors: {
          select: {
            doctorId: true,
            firstName: true,
            surname: true,
            specialization: true,
            email: true,
          },
        },
        secretaries: {
          include: {
            secretary: {
              select: {
                secretaryId: true,
                firstName: true,
                surname: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    return clinic;
  }

  async getClinics(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [clinics, total] = await Promise.all([
      prisma.clinic.findMany({
        skip,
        take: pageSize,
        include: {
          _count: {
            select: {
              doctors: true,
              secretaries: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.clinic.count(),
    ]);

    return {
      clinics,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      total,
    };
  }

  async createClinic(data: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  }) {
    const clinic = await prisma.clinic.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
      },
    });

    logger.info(`Clinic created: ${clinic.clinicId}`);
    return clinic;
  }

  async updateClinic(clinicId: string, data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  }) {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;

    const clinic = await prisma.clinic.update({
      where: { clinicId },
      data: updateData,
    });

    logger.info(`Clinic updated: ${clinicId}`);
    return clinic;
  }

  async deleteClinic(clinicId: string) {
    await prisma.clinic.delete({
      where: { clinicId },
    });
    logger.info(`Clinic deleted: ${clinicId}`);
  }
}

export const clinicService = new ClinicService();


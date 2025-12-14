import prisma from '../config/database';
import { hashPassword, generateDefaultPassword } from '../utils/password';
import { logger } from '../config/logger';

export class SecretaryService {
  async getSecretary(secretaryId: string) {
    const secretary = await prisma.secretary.findUnique({
      where: { secretaryId },
      include: {
        doctors: {
          include: {
            doctor: {
              select: {
                doctorId: true,
                firstName: true,
                surname: true,
                title: true,
                specialization: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!secretary) {
      throw new Error('Secretary not found');
    }

    const { password, ...secretaryWithoutPassword } = secretary;
    return secretaryWithoutPassword;
  }

  async getSecretaries(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [secretaries, total] = await Promise.all([
      prisma.secretary.findMany({
        skip,
        take: pageSize,
        select: {
          secretaryId: true,
          firstName: true,
          surname: true,
          email: true,
          phone: true,
          doctors: {
            include: {
              doctor: {
                select: {
                  doctorId: true,
                  firstName: true,
                  surname: true,
                  title: true,
                  specialization: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.secretary.count(),
    ]);

    return {
      secretaries,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      total,
    };
  }

  async createSecretary(data: {
    firstName: string;
    surname: string;
    email: string;
    password?: string;
    phone?: string;
    doctorIds?: string[];
  }) {
    const password = data.password || generateDefaultPassword();
    const hashedPassword = await hashPassword(password);

    const doctorConnections = [];
    if (data.doctorIds && data.doctorIds.length > 0) {
      for (const doctorId of data.doctorIds) {
        const doctor = await prisma.doctor.findUnique({
          where: { doctorId },
        });
        if (!doctor) {
          throw new Error(`Médecin avec doctorId "${doctorId}" introuvable`);
        }
        doctorConnections.push({ doctorId: doctor.id });
      }
    }

    const secretary = await prisma.secretary.create({
      data: {
        firstName: data.firstName,
        surname: data.surname,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        doctors: {
          create: doctorConnections,
        },
      },
      include: {
        doctors: {
          include: {
            doctor: {
              select: {
                doctorId: true,
                firstName: true,
                surname: true,
                title: true,
                specialization: true,
              },
            },
          },
        },
      },
    });

    const { password: _, ...secretaryWithoutPassword } = secretary;
    logger.info(`Secretary created: ${secretary.secretaryId}`);
    return secretaryWithoutPassword;
  }

  async updateSecretary(secretaryId: string, data: {
    firstName?: string;
    surname?: string;
    email?: string;
    password?: string;
    phone?: string;
    doctorIds?: string[];
  }) {
    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.surname) updateData.surname = data.surname;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }
    if (data.phone !== undefined) updateData.phone = data.phone;

    if (data.doctorIds !== undefined) {
      const secretary = await prisma.secretary.findUnique({
        where: { secretaryId },
      });

      if (!secretary) {
        throw new Error('Secretary not found');
      }

      await prisma.secretaryDoctor.deleteMany({
        where: { secretaryId: secretary.id },
      });

      if (data.doctorIds.length > 0) {
        const doctors = await Promise.all(
          data.doctorIds.map(doctorId => 
            prisma.doctor.findUnique({ where: { doctorId } })
          )
        );
        
        const invalidDoctor = doctors.find(d => !d);
        if (invalidDoctor) {
          throw new Error('One or more doctors not found');
        }

        updateData.doctors = {
          create: doctors.map(doctor => ({
            doctor: {
              connect: { id: doctor!.id },
            },
          })),
        };
      }
    }

    const secretary = await prisma.secretary.update({
      where: { secretaryId },
      data: updateData,
      include: {
        doctors: {
          include: {
            doctor: {
              select: {
                doctorId: true,
                firstName: true,
                surname: true,
                title: true,
                specialization: true,
              },
            },
          },
        },
      },
    });

    const { password, ...secretaryWithoutPassword } = secretary;
    logger.info(`Secretary updated: ${secretaryId}`);
    return secretaryWithoutPassword;
  }

  async deleteSecretary(secretaryId: string) {
    await prisma.secretary.delete({
      where: { secretaryId },
    });
    logger.info(`Secretary deleted: ${secretaryId}`);
  }

  async getSecretariesByDoctor(doctorId: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { doctorId },
      include: {
        secretaries: {
          include: {
            secretary: {
              select: {
                secretaryId: true,
                firstName: true,
                surname: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    return doctor.secretaries.map(sd => sd.secretary);
  }
}

export const secretaryService = new SecretaryService();

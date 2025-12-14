import prisma from '../config/database';
import { hashPassword, generateDefaultPassword } from '../utils/password';
import { logger } from '../config/logger';

export class PatientService {
  async getPatient(id: string) {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        assignedDoctor: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            specialization: true,
          },
        },
      },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const { password, ...patientWithoutPassword } = patient;
    return patientWithoutPassword;
  }

  async getPatients(page: number = 1, pageSize: number = 10, doctorId?: string) {
    const skip = (page - 1) * pageSize;
    
    logger.info(`🔍 getPatients appelé avec page=${page}, pageSize=${pageSize}, doctorId=${doctorId}`);
    
    let where: any = {};
    if (doctorId) {
      where = { assignedDoctorId: doctorId };
      logger.info(`🔎 Filtre par assignedDoctorId: ${doctorId}`);
    } else {
      logger.info(`📋 Récupération de tous les patients (sans filtre)`);
    }
    
    logger.info(`🔎 Filtre where:`, JSON.stringify(where));

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          id: true,
          firstName: true,
          surname: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          address: true,
          assignedDoctor: {
            select: {
              id: true,
              firstName: true,
              surname: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    logger.info(`✅ ${patients.length} patient(s) trouvé(s) sur ${total} total`);
    if (patients.length > 0) {
      const firstPatient = patients[0];
      logger.info(`📋 Premier patient (structure complète):`, JSON.stringify(firstPatient, null, 2));
      logger.info(`📋 Premier patient - id:`, firstPatient.id);
      logger.info(`📋 Premier patient - assignedDoctor:`, firstPatient.assignedDoctor);
      logger.info(`📋 Premier patient - assignedDoctor.id:`, firstPatient.assignedDoctor?.id);
      logger.info(`📋 Premier patient - Clés disponibles:`, Object.keys(firstPatient));
      if (firstPatient.assignedDoctor) {
        logger.info(`📋 Premier patient - assignedDoctor clés:`, Object.keys(firstPatient.assignedDoctor));
      }
    }

    const transformedPatients = patients.map(patient => ({
      id: patient.id,
      firstName: patient.firstName,
      surname: patient.surname,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      address: patient.address,
      assignedDoctor: patient.assignedDoctor ? {
        id: patient.assignedDoctor.id,
        firstName: patient.assignedDoctor.firstName,
        surname: patient.assignedDoctor.surname,
      } : null,
    }));

    return {
      patients: transformedPatients,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      total,
    };
  }

  async createPatient(data: {
    firstName: string;
    surname: string;
    email: string;
    password?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    assigned_doctor?: string;
  }) {
    const password = data.password || generateDefaultPassword();
    const hashedPassword = await hashPassword(password);

    const dateOfBirth = data.dateOfBirth
      ? new Date(data.dateOfBirth)
      : null;

    const patient = await prisma.patient.create({
      data: {
        firstName: data.firstName,
        surname: data.surname,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        dateOfBirth,
        address: data.address,
        assignedDoctorId: data.assigned_doctor,
      },
      include: {
        assignedDoctor: {
          select: {
            id: true,
            firstName: true,
            surname: true,
          },
        },
      },
    });

    const { password: _, ...patientWithoutPassword } = patient;
    logger.info(`Patient created: ${patient.id}`);
    return patientWithoutPassword;
  }

  async updatePatient(id: string, data: {
    firstName?: string;
    surname?: string;
    email?: string;
    password?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    assigned_doctor?: string;
  }) {
    const updateData: any = {};

    if (data.firstName) updateData.firstName = data.firstName;
    if (data.surname) updateData.surname = data.surname;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }
    if (data.address !== undefined) updateData.address = data.address;
    if (data.assigned_doctor !== undefined) {
      updateData.assignedDoctorId = data.assigned_doctor || null;
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData,
      include: {
        assignedDoctor: {
          select: {
            id: true,
            firstName: true,
            surname: true,
          },
        },
      },
    });

    const { password, ...patientWithoutPassword } = patient;
    logger.info(`Patient updated: ${id}`);
    return patientWithoutPassword;
  }

  async deletePatient(id: string) {
    await prisma.patient.delete({
      where: { id },
    });
    logger.info(`Patient deleted: ${id}`);
  }
}

export const patientService = new PatientService();


import prisma from '../config/database';
import { hashPassword, comparePassword, generateDefaultPassword } from '../utils/password';
import { generateToken, JWTPayload } from '../utils/jwt';
import { logger } from '../config/logger';

export class AuthService {
  async registerPatient(patientData: {
    firstName: string;
    surname: string;
    email: string;
    password: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
  }) {
    const existingPatient = await prisma.patient.findUnique({
      where: { email: patientData.email },
    });

    if (existingPatient) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(patientData.password);

    const patient = await prisma.patient.create({
      data: {
        firstName: patientData.firstName,
        surname: patientData.surname,
        email: patientData.email,
        password: hashedPassword,
        phone: patientData.phone,
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null,
        address: patientData.address,
      },
    });

    const token = generateToken({
      id: patient.id,
      email: patient.email,
      role: 'PATIENT',
    });

    // On renvoie aussi patientId pour coller au frontend
    return {
      token,
      user: {
        id: patient.id,
        patientId: patient.id,
        firstName: patient.firstName,
        surname: patient.surname,
        email: patient.email,
        role: 'PATIENT',
      },
    };
  }

  async loginPatient(email: string, password: string) {
    const patient = await prisma.patient.findUnique({
      where: { email },
    });

    if (!patient) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, patient.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: patient.id,
      email: patient.email,
      role: 'PATIENT',
    });

    // On renvoie aussi patientId pour coller au frontend
    return {
      token,
      user: {
        id: patient.id,
        patientId: patient.id,
        firstName: patient.firstName,
        surname: patient.surname,
        email: patient.email,
        role: 'PATIENT',
      },
    };
  }

  async loginDoctor(email: string, password: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { email },
    });

    if (!doctor) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, doctor.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: doctor.id,
      email: doctor.email,
      role: 'DOCTOR',
    });

    return {
      token,
      user: {
        id: doctor.id,
        firstName: doctor.firstName,
        surname: doctor.surname,
        email: doctor.email,
        role: 'DOCTOR',
        title: doctor.title,
        specialization: doctor.specialization,
      },
    };
  }

  async loginSecretary(email: string, password: string) {
    const secretary = await prisma.secretary.findUnique({
      where: { email },
      include: {
        doctors: {
          include: {
            doctor: true,
          },
        },
      },
    });

    if (!secretary) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, secretary.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: secretary.id,
      email: secretary.email,
      role: 'SECRETARY',
    });

    return {
      token,
      user: {
        id: secretary.id,
        firstName: secretary.firstName,
        surname: secretary.surname,
        email: secretary.email,
        role: 'SECRETARY',
        doctors: secretary.doctors.map(sd => ({
          id: sd.doctor.id,
          firstName: sd.doctor.firstName,
          surname: sd.doctor.surname,
          title: sd.doctor.title,
          specialization: sd.doctor.specialization,
        })),
      },
    };
  }
}

export const authService = new AuthService();


import prisma from '../config/database';
import { logger } from '../config/logger';

export class AvailabilityService {
  /**
   * Génère les créneaux de disponibilité pour un médecin sur une période donnée
   * Les créneaux sont générés selon la durée personnalisée du médecin (slotDuration)
   * entre l'heure d'ouverture et de fermeture
   */
  async generateSlotsForDoctor(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ) {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const slots = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    const [openingHour, openingMinute] = doctor.openingTime.split(':').map(Number);
    const [closingHour, closingMinute] = doctor.closingTime.split(':').map(Number);
    const slotDuration = doctor.slotDuration || 30; // Durée du créneau en minutes (par défaut 30)

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const date = new Date(currentDate);

      let currentHour = openingHour;
      let currentMin = openingMinute;

      while (
        currentHour < closingHour ||
        (currentHour === closingHour && currentMin < closingMinute)
      ) {
        const startTime = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        
        let endHour = currentHour;
        let endMin = currentMin + slotDuration;
        if (endMin >= 60) {
          endHour += Math.floor(endMin / 60);
          endMin = endMin % 60;
        }
        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

        if (endHour > closingHour || (endHour === closingHour && endMin > closingMinute)) {
          break; // Arrêter si le créneau dépasse l'heure de fermeture
        }

        const existingSlot = await prisma.availabilitySlot.findUnique({
          where: {
            doctorId_date_startTime: {
              doctorId: doctor.id,
              date: date,
              startTime: startTime,
            },
          },
        });

        if (!existingSlot) {
          slots.push({
            doctorId: doctor.id,
            date: date,
            startTime: startTime,
            endTime: endTime,
            isAvailable: true,
            isBooked: false,
          });
        }

        currentMin += slotDuration;
        if (currentMin >= 60) {
          currentHour += Math.floor(currentMin / 60);
          currentMin = currentMin % 60;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (slots.length > 0) {
      await prisma.availabilitySlot.createMany({
        data: slots,
        skipDuplicates: true,
      });
      logger.info(`Generated ${slots.length} availability slots for doctor ${doctorId}`);
    }

    return slots.length;
  }

  /**
   * Récupère les créneaux disponibles pour un médecin sur une date donnée
   * Génère automatiquement les créneaux s'ils n'existent pas encore
   */
  async getAvailableSlots(doctorId: string, date: Date) {
    logger.info(`🔍 Recherche du médecin avec ID: ${doctorId}`);
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      logger.error(`❌ Médecin non trouvé avec ID: ${doctorId}`);
      const allDoctors = await prisma.doctor.findMany({
        select: { id: true, firstName: true, surname: true },
        take: 5,
      });
      logger.info(`📋 Médecins disponibles (échantillon):`, allDoctors);
      throw new Error('Doctor not found');
    }
    
    logger.info(`✅ Médecin trouvé: ${doctor.firstName} ${doctor.surname} (ID: ${doctor.id})`);

    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const existingSlots = await prisma.availabilitySlot.findFirst({
      where: {
        doctorId: doctor.id,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });

    if (!existingSlots) {
      await this.generateSlotsForDoctor(doctorId, dateStart, dateEnd);
    }

    const slots = await prisma.availabilitySlot.findMany({
      where: {
        doctorId: doctor.id,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
        isAvailable: true,
        isBooked: false,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return slots;
  }

  /**
   * Marque un créneau comme réservé
   */
  async bookSlot(slotId: string) {
    await prisma.availabilitySlot.update({
      where: { id: slotId },
      data: {
        isBooked: true,
        isAvailable: false,
      },
    });
  }

  /**
   * Libère un créneau (annulation)
   */
  async releaseSlot(slotId: string) {
    await prisma.availabilitySlot.update({
      where: { id: slotId },
      data: {
        isBooked: false,
        isAvailable: true,
      },
    });
  }

  /**
   * Supprime les créneaux passés (nettoyage)
   */
  async cleanupPastSlots() {
    const now = new Date();
    const deleted = await prisma.availabilitySlot.deleteMany({
      where: {
        date: {
          lt: now,
        },
      },
    });
    logger.info(`Cleaned up ${deleted.count} past availability slots`);
    return deleted.count;
  }
}

export const availabilityService = new AvailabilityService();


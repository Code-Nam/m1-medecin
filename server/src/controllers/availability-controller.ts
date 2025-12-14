import { Response } from 'express';
import { availabilityService } from '../services/availability-service';
import { AuthRequest } from '../middlewares/auth-middleware';

export class AvailabilityController {
  async generateSlots(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate are required' });
      }

      const count = await availabilityService.generateSlotsForDoctor(
        id,
        new Date(startDate),
        new Date(endDate)
      );

      res.json({
        message: `Generated ${count} availability slots`,
        count,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to generate slots' });
    }
  }

  async getAvailableSlots(req: AuthRequest | any, res: Response) {
    try {
      const { id } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'date query parameter is required' });
      }

      if (!id) {
        return res.status(400).json({ error: 'doctor ID is required' });
      }

      const slots = await availabilityService.getAvailableSlots(
        id,
        new Date(date as string)
      );

      res.json({
        slots: slots.map(slot => ({
          slotId: slot.id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable,
          isBooked: slot.isBooked,
        })),
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to get available slots' });
    }
  }

  async cleanupPastSlots(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN' && req.user?.role !== 'DOCTOR') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const count = await availabilityService.cleanupPastSlots();
      res.json({
        message: `Cleaned up ${count} past slots`,
        count,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to cleanup slots' });
    }
  }
}

export const availabilityController = new AvailabilityController();


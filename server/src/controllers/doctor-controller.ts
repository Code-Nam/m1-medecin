import { Response } from 'express';
import { doctorService } from '../services/doctor-service';
import { AuthRequest } from '../middlewares/auth-middleware';

export class DoctorController {
  async getDoctor(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const doctor = await doctorService.getDoctor(id);
      res.json(doctor);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Doctor not found' });
    }
  }

  async getDoctors(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const result = await doctorService.getDoctors(page, pageSize);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch doctors' });
    }
  }

  async getAllDoctors(req: AuthRequest, res: Response) {
    try {
      const doctors = await doctorService.getAllDoctors();
      res.json({ doctors });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch doctors' });
    }
  }

  async createDoctor(req: Request, res: Response) {
    try {
      const doctor = await doctorService.createDoctor(req.body);
      res.status(201).json({
        message: 'Doctor creation request received and is under review.',
        doctor,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create doctor' });
    }
  }

  async updateDoctor(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (req.user?.role === 'DOCTOR' && req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
      }

      const doctor = await doctorService.updateDoctor(id, req.body);
      res.json(doctor);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update doctor' });
    }
  }

  async deleteDoctor(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (req.user?.role === 'DOCTOR' && req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
      }

      await doctorService.deleteDoctor(id);
      res.json({
        message: 'Doctor deletion request received and is under review.',
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete doctor' });
    }
  }
}

export const doctorController = new DoctorController();


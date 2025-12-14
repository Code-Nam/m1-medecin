import { Response } from 'express';
import { patientService } from '../services/patient-service';
import { AuthRequest } from '../middlewares/auth-middleware';

export class PatientController {
  async getPatient(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const patient = await patientService.getPatient(id);
      res.json(patient);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Patient not found' });
    }
  }

  async getPatients(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const doctorId = req.query.doctorId as string | undefined;

      const result = await patientService.getPatients(page, pageSize, doctorId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch patients' });
    }
  }

  async createPatient(req: Request, res: Response) {
    try {
      const patient = await patientService.createPatient(req.body);
      res.status(201).json(patient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create patient' });
    }
  }

  async updatePatient(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (req.user?.role === 'PATIENT' && req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
      }

      const patient = await patientService.updatePatient(id, req.body);
      res.json(patient);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update patient' });
    }
  }

  async deletePatient(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (req.user?.role === 'PATIENT' && req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
      }

      await patientService.deletePatient(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete patient' });
    }
  }
}

export const patientController = new PatientController();


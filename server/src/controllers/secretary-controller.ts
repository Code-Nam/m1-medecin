import { Response } from 'express';
import { secretaryService } from '../services/secretary-service';
import { AuthRequest } from '../middlewares/auth-middleware';

export class SecretaryController {
  async getSecretary(req: AuthRequest, res: Response) {
    try {
      const { secretaryId } = req.params;

      if (req.user?.role === 'SECRETARY' && req.user.secretaryId !== secretaryId) {
        return res.status(403).json({ error: 'Forbidden: You can only view your own profile' });
      }

      const secretary = await secretaryService.getSecretary(secretaryId);
      res.json(secretary);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Secretary not found' });
    }
  }

  async getSecretaries(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SECRETARY') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      const result = await secretaryService.getSecretaries(page, pageSize);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch secretaries' });
    }
  }

  async createSecretary(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Only admins can create secretaries' });
      }

      const secretary = await secretaryService.createSecretary(req.body);
      res.status(201).json(secretary);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create secretary' });
    }
  }

  async updateSecretary(req: AuthRequest, res: Response) {
    try {
      const { secretaryId } = req.params;

      if (req.user?.role === 'SECRETARY' && req.user.secretaryId !== secretaryId) {
        return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
      }

      const secretary = await secretaryService.updateSecretary(secretaryId, req.body);
      res.json(secretary);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update secretary' });
    }
  }

  async deleteSecretary(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Only admins can delete secretaries' });
      }

      const { secretaryId } = req.params;
      await secretaryService.deleteSecretary(secretaryId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to delete secretary' });
    }
  }

  async getSecretariesByDoctor(req: AuthRequest, res: Response) {
    try {
      const { doctorId } = req.params;
      const secretaries = await secretaryService.getSecretariesByDoctor(doctorId);
      res.json(secretaries);
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Doctor not found' });
    }
  }
}

export const secretaryController = new SecretaryController();

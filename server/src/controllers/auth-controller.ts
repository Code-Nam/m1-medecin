import { Request, Response } from 'express';
import { authService } from '../services/auth-service';
import { loginSchema } from '../utils/validators';
import { validate } from '../middlewares/validate-middleware';

export class AuthController {
  async loginPatient(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginPatient(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Login failed' });
    }
  }

  async registerPatient(req: Request, res: Response) {
    try {
      const patientData = req.body;
      const result = await authService.registerPatient(patientData);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }

  async loginDoctor(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginDoctor(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Login failed' });
    }
  }

  async loginSecretary(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginSecretary(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Login failed' });
    }
  }
}

export const authController = new AuthController();


import { Router } from 'express';
import { secretaryController } from '../controllers/secretary-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { validate } from '../middlewares/validate-middleware';
import { secretaryCreateSchema, secretaryUpdateSchema } from '../utils/validators';

const router = Router();

router.get('/', authMiddleware, secretaryController.getSecretaries.bind(secretaryController));
router.get('/:secretaryId', authMiddleware, secretaryController.getSecretary.bind(secretaryController));
router.post('/', authMiddleware, validate(secretaryCreateSchema), secretaryController.createSecretary.bind(secretaryController));
router.put('/:secretaryId', authMiddleware, validate(secretaryUpdateSchema), secretaryController.updateSecretary.bind(secretaryController));
router.delete('/:secretaryId', authMiddleware, secretaryController.deleteSecretary.bind(secretaryController));
router.get('/by-doctor/:doctorId', authMiddleware, secretaryController.getSecretariesByDoctor.bind(secretaryController));

export default router;

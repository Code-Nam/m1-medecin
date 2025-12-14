import { Router } from 'express';
import { availabilityController } from '../controllers/availability-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = Router();

router.post('/:id/generate', authMiddleware, availabilityController.generateSlots.bind(availabilityController));
router.get('/:id/slots', availabilityController.getAvailableSlots.bind(availabilityController));
router.post('/cleanup', authMiddleware, availabilityController.cleanupPastSlots.bind(availabilityController));

export default router;


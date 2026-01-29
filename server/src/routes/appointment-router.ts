import { Router } from "express";
import { appointmentController } from "../controllers/appointment/AppointmentController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { validate } from "../middlewares/validate-middleware";
import {
    appointmentCreateSchema,
    appointmentUpdateSchema,
} from "../utils/validators";

const router = Router();

router.get(
    "/",
    authMiddleware,
    appointmentController.getAppointmentsByQuery.bind(appointmentController)
);
router.get(
    "/:appointmentId",
    authMiddleware,
    appointmentController.getAppointmentById.bind(appointmentController)
);
router.post(
    "/",
    authMiddleware,
    validate(appointmentCreateSchema),
    appointmentController.createAppointment.bind(appointmentController)
);
router.put(
    "/:appointmentId",
    authMiddleware,
    validate(appointmentUpdateSchema),
    appointmentController.updateAppointment.bind(appointmentController)
);
router.delete(
    "/:appointmentId",
    authMiddleware,
    appointmentController.deleteAppointment.bind(appointmentController)
);

export default router;

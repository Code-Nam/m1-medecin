import { Router } from "express";
import { patientController } from "../controllers/patient/PatientController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { validate } from "../middlewares/validate-middleware";
import { patientCreateSchema, patientUpdateSchema } from "../utils/validators";

const router = Router();

router.get(
    "/",
    authMiddleware,
    patientController.getPatients.bind(patientController)
);
router.get(
    "/:id",
    authMiddleware,
    patientController.getPatient.bind(patientController)
);
router.post(
    "/",
    validate(patientCreateSchema),
    patientController.createPatient.bind(patientController)
);
router.put(
    "/:id",
    authMiddleware,
    validate(patientUpdateSchema),
    patientController.updatePatient.bind(patientController)
);
router.delete(
    "/:id",
    authMiddleware,
    patientController.deletePatient.bind(patientController)
);

export default router;

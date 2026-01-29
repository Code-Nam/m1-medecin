import { Router } from "express";
import { doctorController } from "../controllers/doctor/DoctorController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { validate } from "../middlewares/validate-middleware";
import { doctorCreateSchema, doctorUpdateSchema } from "../utils/validators";

const router = Router();

router.get(
    "/",
    authMiddleware,
    doctorController.getDoctors.bind(doctorController)
);
router.get(
    "/all",
    authMiddleware,
    doctorController.getAllDoctors.bind(doctorController)
); // Route sans pagination pour les selects
router.get(
    "/:id",
    authMiddleware,
    doctorController.getDoctor.bind(doctorController)
);
router.post(
    "/",
    validate(doctorCreateSchema),
    doctorController.createDoctor.bind(doctorController)
);
router.put(
    "/:id",
    authMiddleware,
    validate(doctorUpdateSchema),
    doctorController.updateDoctor.bind(doctorController)
);
router.delete(
    "/:id",
    authMiddleware,
    doctorController.deleteDoctor.bind(doctorController)
);

export default router;

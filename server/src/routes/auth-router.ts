import { Router } from "express";
import { authController } from "../controllers/auth/AuthController";
import { validate } from "../middlewares/validate-middleware";
import { loginSchema, registerPatientSchema } from "../utils/validators";

const router = Router();

router.post(
    "/patients/login",
    validate(loginSchema),
    authController.loginPatient.bind(authController)
);
router.post(
    "/patients/register",
    validate(registerPatientSchema),
    authController.registerPatient.bind(authController)
);
router.post(
    "/doctors/login",
    validate(loginSchema),
    authController.loginDoctor.bind(authController)
);
router.post(
    "/secretaries/login",
    validate(loginSchema),
    authController.loginSecretary.bind(authController)
);

export default router;

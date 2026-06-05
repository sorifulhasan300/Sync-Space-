import { Router } from "express";
import { AuthValidations } from "../../../validatons/auth.validation";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../../middleware/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidations.registerSchema),
  AuthController.register,
);
router.post(
  "/login",
  validateRequest(AuthValidations.loginSchema),
  AuthController.login,
);

export const AuthRoutes = router;

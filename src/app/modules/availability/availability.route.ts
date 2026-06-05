import { Router } from "express";
import { AvailabilityController } from "./availability.controller";
import { USER_ROLES } from "../../../constants/user.constant";
import { authCheck, tenantGuard } from "../../../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authCheck(USER_ROLES.ORG_ADMIN, USER_ROLES.EMPLOYEE),
  tenantGuard,
  AvailabilityController.getAvailableSlots,
);

export const AvailabilityRoutes = router;

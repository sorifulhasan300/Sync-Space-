import { Router } from "express";
import { authCheck, tenantGuard } from "../../../middleware/auth.middleware";
import { USER_ROLES } from "../../../constants/user.constant";
import { validateRequest } from "../../../middleware/validateRequest";
import { BookingValidations } from "../../../validatons/booking.validation";
import { ResourceController } from "./resource.controller";

const router = Router();

router.post(
  "/",
  authCheck(USER_ROLES.ORG_ADMIN),
  tenantGuard,
  validateRequest(BookingValidations.createResourceSchema),
  ResourceController.createResource,
);

router.get(
  "/",
  authCheck(USER_ROLES.ORG_ADMIN, USER_ROLES.EMPLOYEE),
  tenantGuard,
  ResourceController.getResources,
);

router.delete(
  "/:id/soft-delete",
  authCheck(USER_ROLES.ORG_ADMIN),
  tenantGuard,
  ResourceController.deleteResource,
);

export const ResourceRoutes = router;

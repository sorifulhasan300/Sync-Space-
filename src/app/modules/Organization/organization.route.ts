import { Router } from "express";
import { OrganizationController } from "./organization.controller";
import { validateRequest } from "../../../middleware/validateRequest";
import { OrganizationValidations } from "../../../validatons/organization.validation";

const router = Router();

router.post(
  "/",
  validateRequest(OrganizationValidations.createOrganizationSchema),
  OrganizationController.createOrganization,
);

router.get("/", OrganizationController.getAllOrganizations);

export const OrganizationRoutes = router;

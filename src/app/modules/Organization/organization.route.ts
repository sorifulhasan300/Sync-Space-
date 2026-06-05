import { Router } from "express";
import { validateRequest } from "../../../middleware/validateRequest";
import { OrganizationValidations } from "../../../validatons/organization.validation";
import { OrganizationController } from "./organization.controller";

const router = Router();

router.post(
  "/",
  validateRequest(OrganizationValidations.createOrganizationSchema),
  OrganizationController.createOrganization,
);

router.get("/", OrganizationController.getAllOrganizations);

export const OrganizationRoutes = router;

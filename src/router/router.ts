import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { OrganizationRoutes } from "../app/modules/Organization/organization.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/organizations", OrganizationRoutes);

export const BaseRouter = router;

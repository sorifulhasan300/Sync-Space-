import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { OrganizationRoutes } from "../app/modules/organization/organization.route";
import { ResourceRoutes } from "../app/modules/resource/resource.route";
import { BookingRoutes } from "../app/modules/booking/booking.route";
import { AvailabilityRoutes } from "../app/modules/availability/availability.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/organizations", OrganizationRoutes);
router.use("/resource", ResourceRoutes);
router.use("/booking", BookingRoutes);
router.use("/availability", AvailabilityRoutes);

export const BaseRouter = router;

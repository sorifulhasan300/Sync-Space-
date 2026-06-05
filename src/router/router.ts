import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { OrganizationRoutes } from "../app/modules/Organization/organization.route";
import { ResourceRoutes } from "../app/modules/Resource/resource.route";
import { BookingRoutes } from "../app/modules/Booking/booking.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/organizations", OrganizationRoutes);
router.use("/resource", ResourceRoutes);
router.use("/booking", BookingRoutes);

export const BaseRouter = router;

import { Router } from "express";
import { USER_ROLES } from "../../../constants/user.constant";
import { authCheck, tenantGuard } from "../../../middleware/auth.middleware";
import { validateRequest } from "../../../middleware/validateRequest";
import { BookingValidations } from "../../../validatons/booking.validation";
import { BookingController } from "./booking.controller";

const router = Router();

router.post(
  "/",
  authCheck(USER_ROLES.ORG_ADMIN, USER_ROLES.EMPLOYEE),
  tenantGuard,
  validateRequest(BookingValidations.createBookingSchema),
  BookingController.createBooking,
);

router.get(
  "/",
  authCheck(USER_ROLES.ORG_ADMIN, USER_ROLES.EMPLOYEE),
  tenantGuard,
  BookingController.getAllBookings,
);

export const BookingRoutes = router;

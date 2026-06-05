import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { catchAsync } from "../../../utils/catchAsync";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.tenantId as string;
  const userId = req.user?.userId as string; // auth মিডলওয়্যার থেকে প্রাপ্ত

  const result = await BookingService.createBooking(tenantId, userId, req.body);

  res.status(201).json({
    status: "success",
    message: "Booking created successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.tenantId as string;
  const result = await BookingService.getAllBookings(tenantId);

  res.status(200).json({
    status: "success",
    results: result.length,
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
};

import { Request, Response } from "express";
import { AvailabilityService } from "./availability.service";
import { catchAsync } from "../../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";

const getAvailableSlots = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.tenantId as string;
  const { resourceId, date, duration } = req.query;

  if (!resourceId || !date) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "fail",
      message: "resourceId and date (YYYY-MM-DD) are required query parameters",
    });
    return;
  }

  const slotDuration = duration ? parseInt(duration as string, 10) : 60;

  const result = await AvailabilityService.generateAvailableSlots(
    tenantId,
    resourceId as string,
    date as string,
    slotDuration,
  );

  res.status(StatusCodes.OK).json({
    code: StatusCodes.OK,
    status: "success",
    data: result,
  });
});

export const AvailabilityController = {
  getAvailableSlots,
};

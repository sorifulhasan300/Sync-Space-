import { DateTime, Interval } from "luxon";
import { Booking } from "../../../models/Booking";
import { Resource } from "../../../models/Resource";
import { Organization } from "../../../models/Organization";
import { Types } from "mongoose";

const getAllBookings = async (tenantId: string) => {
  return await Booking.find({ tenantId: tenantId as any }).populate(
    "resourceId userId",
    "name email type",
  );
};

const createBooking = async (
  tenantId: string,
  userId: string,
  bookingData: { resourceId: string; startTime: string; endTime: string },
) => {
  const { resourceId, startTime, endTime } = bookingData;

  const resource = await Resource.findOne({
    _id: resourceId,
    tenantId,
    isDeleted: false,
  } as any);
  if (!resource) {
    const error = new Error("Resource not found or access denied") as any;
    error.statusCode = 404;
    throw error;
  }

  const org = await Organization.findById(tenantId);
  if (!org || org.status !== "active") {
    const error = new Error("Organization is inactive or not found") as any;
    error.statusCode = 400;
    throw error;
  }

  const tz = org.timezone;
  const requestedStart = DateTime.fromISO(startTime).setZone(tz);
  const requestedEnd = DateTime.fromISO(endTime).setZone(tz);

  if (!requestedStart.isValid || !requestedEnd.isValid) {
    const error = new Error("Invalid ISO datetime string format") as any;
    error.statusCode = 400;
    throw error;
  }

  if (requestedEnd <= requestedStart) {
    const error = new Error("End time must be after start time") as any;
    error.statusCode = 400;
    throw error;
  }

  const workStart = DateTime.fromISO(
    `${requestedStart.toISODate()}T${org.workingHours.start}`,
    { zone: tz },
  );
  const workEnd = DateTime.fromISO(
    `${requestedStart.toISODate()}T${org.workingHours.end}`,
    { zone: tz },
  );

  if (requestedStart < workStart || requestedEnd > workEnd) {
    const error = new Error(
      `Booking must be within organization working hours (${org.workingHours.start} - ${org.workingHours.end})`,
    ) as any;
    error.statusCode = 400;
    throw error;
  }

  const startOfDoc = requestedStart.startOf("day").toJSDate();
  const endOfDoc = requestedStart.endOf("day").toJSDate();

  const existingBookings = await Booking.find({
    tenantId: tenantId as any,
    resourceId: resourceId as any,
    status: "CONFIRMED",
    startTime: { $gte: startOfDoc },
    endTime: { $lte: endOfDoc },
  } as any);

  const bufferMinutes = resource.bufferTime;

  const candidateInterval = Interval.fromDateTimes(
    requestedStart,
    requestedEnd,
  );

  for (const booking of existingBookings) {
    const existingStart = DateTime.fromJSDate(booking.startTime).setZone(tz);
    const existingEnd = DateTime.fromJSDate(booking.endTime).setZone(tz);

    const existingIntervalWithBuffer = Interval.fromDateTimes(
      existingStart,
      existingEnd.plus({ minutes: bufferMinutes }),
    );

    const candidateIntervalWithBuffer = Interval.fromDateTimes(
      requestedStart,
      requestedEnd.plus({ minutes: bufferMinutes }),
    );

    //  Check if the candidate booking overlaps with the existing booking (considering buffer time)
    if (
      candidateInterval.overlaps(existingIntervalWithBuffer) ||
      candidateIntervalWithBuffer.overlaps(
        Interval.fromDateTimes(existingStart, existingEnd),
      )
    ) {
      const error = new Error(
        "Booking conflict detected! The slot or its resource buffer time overlaps with an existing booking.",
      ) as any;
      error.statusCode = 409; // Conflict Status Code
      throw error;
    }
  }

  const newBooking = await Booking.create({
    tenantId: new Types.ObjectId(tenantId) as any,
    userId: new Types.ObjectId(userId) as any,
    resourceId: new Types.ObjectId(resourceId) as any,
    startTime: requestedStart.toJSDate(),
    endTime: requestedEnd.toJSDate(),
    status: "CONFIRMED",
  });

  return newBooking;
};

export const BookingService = {
  getAllBookings,
  createBooking,
};

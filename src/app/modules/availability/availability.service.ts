import { DateTime, Interval } from "luxon";
import { Resource } from "../../../models/Resource";
import { Booking } from "../../../models/Booking";
import { Organization } from "../../../models/Organization";

const checkResourceAvailability = async (
  tenantId: string,
  resourceId: string,
  dateStr: string, // Format: 'YYYY-MM-DD'
  slotDurationMinutes: number = 60,
) => {
  const resource = await Resource.findOne({
    _id: resourceId,
    tenantId: tenantId as any,
    isDeleted: false,
  } as any);
  if (!resource) throw new Error("Resource not found or access denied");

  const org = await Organization.findById(tenantId);
  if (!org || org.status !== "active")
    throw new Error("Organization is inactive or not found");

  const { timezone, workingHours } = org;
  const bufferTime = resource.bufferTime; // মিনিটে (e.g., 15)

  const startWork = DateTime.fromISO(`${dateStr}T${workingHours.start}`, {
    zone: timezone,
  });
  const endWork = DateTime.fromISO(`${dateStr}T${workingHours.end}`, {
    zone: timezone,
  });

  if (!startWork.isValid || !endWork.isValid) {
    throw new Error("Invalid date or working hours configuration");
  }

  const dayStartUTC = startWork.startOf("day").toJSDate();
  const dayEndUTC = startWork.endOf("day").toJSDate();

  const existingBookings = await Booking.find({
    tenantId: tenantId as any,
    resourceId: resourceId as any,
    status: "CONFIRMED",
    startTime: { $gte: dayStartUTC },
    endTime: { $lte: dayEndUTC },
  } as any).sort({ startTime: 1 });

  const bookedIntervals = existingBookings.map((booking) => {
    const bStart = DateTime.fromJSDate(booking.startTime).setZone(timezone);
    const bEnd = DateTime.fromJSDate(booking.endTime).setZone(timezone);

    return Interval.fromDateTimes(bStart, bEnd.plus({ minutes: bufferTime }));
  });

  const availableSlots = [];
  let currentSlotStart = startWork;

  while (currentSlotStart.plus({ minutes: slotDurationMinutes }) <= endWork) {
    const currentSlotEnd = currentSlotStart.plus({
      minutes: slotDurationMinutes,
    });
    const candidateInterval = Interval.fromDateTimes(
      currentSlotStart,
      currentSlotEnd,
    );

    let isOverlapped = bookedIntervals.some((bookedInterval) =>
      candidateInterval.overlaps(bookedInterval),
    );

    if (!isOverlapped) {
      const candidateIntervalWithBuffer = Interval.fromDateTimes(
        currentSlotStart,
        currentSlotEnd.plus({ minutes: bufferTime }),
      );
      isOverlapped = existingBookings.some((booking) => {
        const bStart = DateTime.fromJSDate(booking.startTime).setZone(timezone);
        const bEnd = DateTime.fromJSDate(booking.endTime).setZone(timezone);
        return candidateIntervalWithBuffer.overlaps(
          Interval.fromDateTimes(bStart, bEnd),
        );
      });
    }

    if (!isOverlapped) {
      availableSlots.push({
        startTime: currentSlotStart.toISO(),
        endTime: currentSlotEnd.toISO(),
      });
    }

    currentSlotStart = currentSlotEnd;
  }

  return {
    date: dateStr,
    resourceId,
    timezone,
    totalAvailableSlots: availableSlots.length,
    slots: availableSlots,
  };
};

export const AvailabilityService = {
  generateAvailableSlots: checkResourceAvailability,
};

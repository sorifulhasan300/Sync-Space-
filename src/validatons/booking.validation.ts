import { z } from "zod";

const createResourceSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Resource name is required").trim(),
    type: z.enum(["ROOM", "DESK", "DEVICE"], {
      message: "Invalid resource type",
    }),
    bufferTime: z
      .number()
      .nonnegative("Buffer time cannot be negative")
      .default(0),
  }),
});

const createBookingSchema = z.object({
  body: z.object({
    resourceId: z
      .string()
      .min(1, "Resource ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Resource ObjectId"),
    startTime: z
      .string()
      .min(1, "Start time is required")
      .datetime("Invalid ISO datetime string"),
    endTime: z
      .string()
      .min(1, "End time is required")
      .datetime("Invalid ISO datetime string"),
  }),
});

export const BookingValidations = {
  createResourceSchema,
  createBookingSchema,
};

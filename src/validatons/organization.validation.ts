import { z } from "zod";

const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Organization name is required").trim(),
    timezone: z.string().min(1, "Timezone is required").trim(), // e.g., 'Asia/Dhaka', 'America/New_York'
    workingHours: z.object({
      start: z
        .string()
        .min(1, "Working start hour is required")
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          "Invalid start time format (HH:MM in 24h)",
        ),
      end: z
        .string()
        .min(1, "Working end hour is required")
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          "Invalid end time format (HH:MM in 24h)",
        ),
    }),
  }),
});

export const OrganizationValidations = {
  createOrganizationSchema,
};

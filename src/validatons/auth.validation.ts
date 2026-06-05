import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["ORG_ADMIN", "EMPLOYEE"], {
      message: "Role must be ORG_ADMIN or EMPLOYEE",
    }),
    tenantId: z
      .string()
      .min(1, "Tenant ID is required")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Tenant ObjectId"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const AuthValidations = {
  registerSchema,
  loginSchema,
};

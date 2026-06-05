import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .url({ message: "DATABASE_URL অবশ্যই একটি বৈধ URL হতে হবে" }),
  JWT_SECRET: z
    .string()
    .min(8, { message: "JWT_SECRET কমপক্ষে ৮ ক্যারেক্টার হতে হবে" }),
});

export type EnvConfig = z.infer<typeof envSchema>;

const parseEnv = envSchema.safeParse(process.env);

if (!parseEnv.success) {
  console.error("Invalid environment variables:");
  console.error(JSON.stringify(parseEnv.error.format(), null, 2));
  process.exit(1);
}

export const env: EnvConfig = parseEnv.data;

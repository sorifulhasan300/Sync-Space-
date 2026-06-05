import { Schema, model, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  timezone: string; // e.g., 'Asia/Dhaka', 'America/New_York'
  workingHours: {
    start: string; // e.g., '09:00' (24-hour format)
    end: string; // e.g., '17:00'
  };
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    timezone: { type: String, required: true, default: "UTC" },
    workingHours: {
      start: { type: String, required: true, default: "09:00" },
      end: { type: String, required: true, default: "17:00" },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);

export const Organization = model<IOrganization>(
  "Organization",
  OrganizationSchema,
);

import { Schema, model, Document } from "mongoose";

export interface IBooking extends Document {
  tenantId: Schema.Types.ObjectId;
  resourceId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  startTime: Date; // UTC Date object
  endTime: Date; // UTC Date object
  status: "CONFIRMED" | "CANCELLED";
}

const BookingSchema = new Schema<IBooking>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true },
);

BookingSchema.index({ tenantId: 1, resourceId: 1, startTime: 1, endTime: 1 });

export const Booking = model<IBooking>("Booking", BookingSchema);

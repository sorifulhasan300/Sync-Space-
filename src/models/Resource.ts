import { Schema, model, Document } from "mongoose";

export interface IResource extends Document {
  tenantId: Schema.Types.ObjectId;
  name: string;
  type: "ROOM" | "DESK" | "DEVICE";
  bufferTime: number;
  isDeleted: boolean;
}

const ResourceSchema = new Schema<IResource>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["ROOM", "DESK", "DEVICE"], required: true },
    bufferTime: { type: Number, required: true, default: 0 }, // minutes
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ResourceSchema.index({ tenantId: 1, name: 1 }, { unique: true });
ResourceSchema.index({ tenantId: 1, isDeleted: 1 });

export const Resource = model<IResource>("Resource", ResourceSchema);

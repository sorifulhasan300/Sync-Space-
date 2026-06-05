import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  tenantId: Schema.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "ORG_ADMIN" | "EMPLOYEE";
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false }, // Query করার সময় পাসওয়ার্ড যেন বাই-ডিফল্ট না আসে
    role: { type: String, enum: ["ORG_ADMIN", "EMPLOYEE"], required: true },
  },
  { timestamps: true },
);

UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

UserSchema.pre("save", async function (this: IUser, next: any) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>("User", UserSchema);

import jwt from "jsonwebtoken";
import { Organization } from "../../../models/Organization";
import { IUser, User } from "../../../models/User";
import { AppError } from "../../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const AuthService = {
  registerUser: async (userData: Partial<IUser>) => {
    const existingUser = await User.findOne({
      email: userData.email,
      tenantId: userData.tenantId,
    });

    if (existingUser) {
      throw new AppError(
        "Email is already registered in this organization",
        StatusCodes.BAD_REQUEST,
      );
    }

    const newUser = await User.create(userData);

    const result = newUser.toObject();
    delete result.password;
    return result;
  },

  loginUser: async (email: string, password: string) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const org = await Organization.findById(user.tenantId);
    if (!org || org.status !== "active") {
      throw new AppError("Your organization is inactive or suspended", StatusCodes.FORBIDDEN);
    }

    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  },
};

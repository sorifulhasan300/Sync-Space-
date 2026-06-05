import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Organization } from "../models/Organization";
import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../constants/user.constant";
import { IDecodedToken } from "../types/token.types";
import { env } from "../config/env.config";
const JWT_SECRET = env.JWT_SECRET || "super-secret-key";

export const authCheck = (...requiredRoles: USER_ROLES[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          status: "fail",
          message: "You are not authorized! Token missing.",
        });
        return;
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      const decoded = jwt.verify(token, JWT_SECRET) as IDecodedToken;

      const { role, tenantId } = decoded;

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        res.status(StatusCodes.FORBIDDEN).json({
          status: "fail",
          message: "You have no permission to access this route",
        });
        return;
      }

      req.user = decoded;
      req.tenantId = tenantId;

      next();
    } catch (error) {
      res.status(StatusCodes.FORBIDDEN).json({
        status: "fail",
        message: "Unauthorized: Invalid or expired token",
      });
    }
  };
};

export const tenantGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "fail",
        message: "Tenant identifier is missing in the request context",
      });
      return;
    }

    const organization = await Organization.findById(tenantId);

    if (!organization) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", message: "Tenant Organization not found" });
      return;
    }

    if (organization.status !== "active") {
      res.status(StatusCodes.FORBIDDEN).json({
        status: "fail",
        message:
          "Forbidden: Your organization account is suspended or inactive",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

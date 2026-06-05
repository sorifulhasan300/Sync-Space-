import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new AppError(
    `Not Found - ${req.originalUrl}`,
    StatusCodes.NOT_FOUND,
  );
  res.status(StatusCodes.NOT_FOUND);
  next(error);
};

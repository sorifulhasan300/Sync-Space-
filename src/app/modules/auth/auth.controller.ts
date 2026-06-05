import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.loginUser(email, password);
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Logged in successfully",
    data: result,
  });
});

export const AuthController = {
  register,
  login,
};

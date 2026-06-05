import { Request, Response } from "express";
import { OrganizationService } from "./organization.service";
import { catchAsync } from "../../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";

const createOrganization = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationService.createOrganization(req.body);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Organization created successfully",
    data: result,
  });
});

const getAllOrganizations = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationService.getAllOrganizations();
  res.status(StatusCodes.OK).json({
    status: "success",
    data: result,
  });
});

export const OrganizationController = {
  createOrganization,
  getAllOrganizations,
};

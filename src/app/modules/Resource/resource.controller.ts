import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { ResourceService } from "./resource.service";
import { StatusCodes } from "http-status-codes";

const createResource = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.tenantId as string;
  const result = await ResourceService.createResource(tenantId, req.body);

  res.status(StatusCodes.CREATED).json({
    code: StatusCodes.CREATED,
    status: "success",
    message: "Resource created successfully",
    data: result,
  });
});

const getResources = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.tenantId as string;
  const result = await ResourceService.getResources(tenantId);

  res.status(StatusCodes.OK).json({
    code: StatusCodes.OK,
    status: "success",
    results: result.length,
    data: result,
  });
});

const deleteResource = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.tenantId as string;
  const { id } = req.params;
  await ResourceService.softDeleteResource(tenantId, id as string);

  res.status(StatusCodes.OK).json({
    code: StatusCodes.OK,
    status: "success",
    message: "Resource deleted successfully (Soft Delete)",
  });
});

export const ResourceController = {
  createResource,
  getResources,
  deleteResource,
};

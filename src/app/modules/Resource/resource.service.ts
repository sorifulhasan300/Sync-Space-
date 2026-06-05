import { IResource, Resource } from "../../../models/Resource";
import { AppError } from "../../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

const createResource = async (
  tenantId: string,
  resourceData: Partial<IResource>,
) => {
  const existingResource = await Resource.findOne({
    tenantId: tenantId as any,
    name: resourceData.name,
    isDeleted: false,
  });

  if (existingResource) {
    throw new AppError(
      "Resource with this name already exists in your organization",
      StatusCodes.BAD_REQUEST,
    );
  }

  const newResource = await Resource.create({
    ...resourceData,
    tenantId: tenantId as any,
  });

  return newResource;
};

const getResources = async (tenantId: string) => {
  return await Resource.find({ tenantId: tenantId as any, isDeleted: false });
};
const softDeleteResource = async (tenantId: string, resourceId: string) => {
  const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
  const resourceObjectId = new mongoose.Types.ObjectId(resourceId);

  const resource = await Resource.findOneAndUpdate(
    {
      _id: resourceObjectId,
      tenantId: tenantObjectId,
      isDeleted: false,
    } as any,
    { isDeleted: true },
    { new: true },
  );

  if (!resource) {
    throw new AppError(
      "Resource not found or unauthorized",
      StatusCodes.NOT_FOUND,
    );
  }

  return resource;
};
export const ResourceService = {
  createResource,
  getResources,
  softDeleteResource,
};

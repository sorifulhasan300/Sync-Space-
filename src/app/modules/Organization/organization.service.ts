import { Organization, IOrganization } from "../../../models/Organization";
import { StatusCodes } from "http-status-codes";

const createOrganization = async (orgData: Partial<IOrganization>) => {
  const existingOrg = await Organization.findOne({ name: orgData.name });
  if (existingOrg) {
    const error = new Error("Organization name already exists") as any;
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  const newOrg = await Organization.create(orgData);
  return newOrg;
};

const getAllOrganizations = async () => {
  const organizations = await Organization.find();
  return organizations;
};

export const OrganizationService = {
  createOrganization,
  getAllOrganizations,
};

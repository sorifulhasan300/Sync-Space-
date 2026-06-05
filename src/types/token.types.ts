import { USER_ROLES } from "../constants/user.constant";

export interface IDecodedToken {
  userId: string;
  tenantId: string;
  role: USER_ROLES;
}

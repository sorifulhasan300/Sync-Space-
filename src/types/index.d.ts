import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        tenantId: string;
        role: "ORG_ADMIN" | "EMPLOYEE";
      };
      tenantId?: string; 
    }
  }
}

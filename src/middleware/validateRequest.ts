import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validateRequest = (schema: ZodObject<any>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));
        res.status(400).json({ status: "fail", errors: errorMessages });
        return;
      }
      next(error);
    }
  };
};

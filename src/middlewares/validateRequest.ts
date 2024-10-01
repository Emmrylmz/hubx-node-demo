import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

// Generic input validation middleware
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(422).json({
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      next(error);
    }
  };
};

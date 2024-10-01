import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validateRequest = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        schemas.body.parse(req.body); // Validate request body
      }
      if (schemas.query) {
        schemas.query.parse(req.query); // Validate query parameters
      }
      if (schemas.params) {
        schemas.params.parse(req.params); // Validate route parameters
      }
      next(); // If validation passes, proceed to the next middleware
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
      next(error); // Forward the error to the error-handling middleware
    }
  };
};

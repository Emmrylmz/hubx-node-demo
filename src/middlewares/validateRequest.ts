import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/errors.ts";
import { ZodError, ZodSchema } from "zod";

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Validates a request against a set of Zod schemas.
 * @param {ValidationSchemas} schemas - An object containing Zod schemas to validate against. The object can have the following properties:
 *   - `body`: The schema to validate the request body against.
 *   - `query`: The schema to validate the query parameters against.
 *   - `params`: The schema to validate the route parameters against.
 * @returns {RequestHandler} - A middleware function that validates the request and calls the next middleware if the validation passes, or forwards the validation error to the error-handling middleware if the validation fails.
 */
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
        next(ValidationError.fromZodError(error));
      }
      next(error); // Forward the error to the error-handling middleware
    }
  };
};

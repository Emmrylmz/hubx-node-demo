// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "../errors/errors.ts";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the error for debugging

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.message;
  }
  if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }
  if (err instanceof DatabaseError) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
};

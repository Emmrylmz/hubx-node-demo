import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.ts";
import { DatabaseError, NotFoundError, ValidationError } from "../errors/errors.ts";

/**
 * Defines the structure of an error handler function.
 * @typedef {function} ErrorHandler
 * @param {Error} err - The error object to handle.
 * @param {Request} req - The Express request object.
 * @returns {{statusCode: number, message: string, errors?: any}} The error response object.
 */
type ErrorHandler = (err: Error, req: Request) => {
  statusCode: number;
  message: string;
  errors?: any;
};

/**
 * A class for centralized error handling in an Express application.
 */
class ErrorHandlerClass {
  /** @private */
  private errorHandlers: Map<string, ErrorHandler>;

  /**
   * Creates an instance of ErrorHandlerClass.
   * Initializes the error handlers map.
   */
  constructor() {
    this.errorHandlers = new Map();
    this.initializeErrorHandlers();
  }

  /**
   * Initializes error handlers for specific error types and a default handler.
   * @private
   */
  private initializeErrorHandlers() {
    this.errorHandlers.set(ValidationError.name, (err: ValidationError, req) => ({
      statusCode: 422,
      message: err.message,
      errors: err.errors,
    }));

    this.errorHandlers.set(NotFoundError.name, (err, req) => ({
      statusCode: 404,
      message: err.message,
    }));

    this.errorHandlers.set(DatabaseError.name, (err, req) => ({
      statusCode: 500,
      message: "Database error occurred",
    }));

    // Default handler for unexpected errors
    this.errorHandlers.set("default", (err, req) => {
      logger.error("Unexpected error:", err);
      return {
        statusCode: 500,
        message: "Internal Server Error",
      };
    });
  }

  /**
   * Main error handling middleware for Express.
   * @param {Error} err - The error object.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  public handle = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const handler = this.errorHandlers.get(err.constructor.name) || this.errorHandlers.get("default");
    const { statusCode, message, errors } = handler(err, req);

    this.logError(err, req);

    const errorResponse: any = {
      error: {
        message,
        status: statusCode,
        errorId: this.generateErrorId(),
      },
    };

    if (errors) {
      errorResponse.error.errors = errors;
    }

    if (process.env.NODE_ENV === "development") {
      errorResponse.error.stack = err.stack;
    }
    
    const { errorId, ...rest } = errorResponse.error;
    res.status(statusCode).json(rest);
  };

  /**
   * Logs the error details.
   * @private
   * @param {Error} err - The error object.
   * @param {Request} req - The Express request object.
   */
  private logError(err: Error, req: Request): void {
    logger.error({
      message: `Error ${err.name}: ${err.message}`,
      stack: err.stack,
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body,
    });
  }

  /**
   * Generates a unique error ID.
   * @private
   * @returns {string} A unique error identifier.
   */
  private generateErrorId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

/**
 * Singleton instance of the ErrorHandlerClass.
 * @type {ErrorHandlerClass}
 */
export const errorHandler = new ErrorHandlerClass();
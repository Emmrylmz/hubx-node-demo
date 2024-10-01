import { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "../errors/errors.ts";
import logger from "../utils/logger.ts"; 

class ErrorHandler {
  public handle = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    this.logError(err, req);

    const { statusCode, message, errors } = this.getErrorDetails(err);
    const errorId = this.generateErrorId();

    const errorResponse: any = {
      error: {
        message,
        status: statusCode,
        errorId,
      },
    };

    if (errors) {
      errorResponse.error.errors = errors;
    }

    if (process.env.NODE_ENV === "development") {
      errorResponse.error.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
  }

  private logError(err: any, req: Request): void {
    logger.error({
      message: `Error ${err.name}: ${err.message}`,
      stack: err.stack,
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
      body: req.body
    });
  }

  private getErrorDetails(err: any): { statusCode: number, message: string, errors: string | null } {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: string | null = null;

    switch (true) {
      case err instanceof SyntaxError && err.message.includes("JSON"):
        statusCode = 400;
        message = "Invalid JSON payload";
        errors = "Malformed JSON in request body";
        break;
      case err instanceof ValidationError:
        statusCode = 400;
        message = err.message;
        errors = err.name;
        break;
      case err instanceof NotFoundError:
        statusCode = 404;
        message = err.message;
        break;
      case err instanceof DatabaseError:
        statusCode = 500;
        message = "Database error occurred";
        break;
      default:
        logger.error("Unexpected error:", err);
    }

    return { statusCode, message, errors };
  }

  //To log error in a database if needed
  private generateErrorId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const errorHandler = new ErrorHandler();
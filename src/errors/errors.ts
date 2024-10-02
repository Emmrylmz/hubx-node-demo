import { ZodError } from "zod";

export class NotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "NotFoundError";
    }
  }
  
  
  export class DatabaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "DatabaseError";
    }
  }
  
  export class ValidationError extends Error {
    public errors: any[];
  
    constructor(message: string, errors: any[] = []) {
      super(message);
      this.name = "ValidationError";
      this.errors = errors;
    }
  
    static fromZodError(zodError: ZodError): ValidationError {
      const errors = zodError.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return new ValidationError("Validation failed", errors);
    }
  }
import { ObjectId } from "mongodb";
import { ValidationError } from "../errors/errors.ts";

export function validateObjectId(id: string): void {
  if (!ObjectId.isValid(id)) {
    throw new ValidationError(`Invalid ObjectId: ${id}`);
  }
}

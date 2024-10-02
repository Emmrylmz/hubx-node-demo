import { isValidObjectId } from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine(isValidObjectId, {
    message: "Invalid ObjectId format",
  });
  
  export const ObjectIdValidationZod = z.object({
    id: objectIdSchema,
  });
  
import { isValidObjectId } from "mongoose";
import { authorSchemaZod } from "../author/author.schema.zod.ts";
import { z } from "zod";

export const createBookSchemaZod = z.object({
    // _id: z.union([z.string(), z.object()]),
    title: z
      .string()
      .min(1, { message: "Title is required and cannot be empty" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    isbn: z
      .string()
      .regex(
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
      )
      .min(1, { message: "ISBN is required and cannot be empty" }),
    language: z
      .string()
      .min(1, { message: "Language is required and cannot be empty" }),
    numberOfPages: z
      .number()
      .min(1, { message: "Number of pages must be a positive number" }),
    publisher: z
      .string()
      .min(1, { message: "Publisher is required and cannot be empty" }),
    author: authorSchemaZod,
  });
  
  export const updateBookSchemaZod = z
    .object({
      title: z.string().min(1).max(100).optional(),
      author: authorSchemaZod.optional(),
      publishedYear: z
        .number()
        .int()
        .min(1000)
        .max(new Date().getFullYear())
        .optional(),
      genre: z.enum(["fiction", "non-fiction", "science", "history"]).optional(),
      isbn: z
        .string()
        .regex(
          /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
        )
        .optional(),
    })
    .strict();
  
  const objectIdSchema = z.string().refine(isValidObjectId, {
    message: "Invalid ObjectId format",
  });
  
  export const ObjectIdValidationZod = z.object({
    id: objectIdSchema,
  });
  
  export const paginationQueryParamsZod = z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)) // Default to 1 if not provided
      .refine((val) => val >= 1, { message: "Page must be at least 1" }),
  
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)) // Default to 10 if not provided
      .refine((val) => val >= 1, { message: "Limit must be at least 1" })
      .refine((val) => val <= 25, { message: "Limit must be no more than 25" }),
  });
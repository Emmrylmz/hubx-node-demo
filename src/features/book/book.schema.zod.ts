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
  
 
 
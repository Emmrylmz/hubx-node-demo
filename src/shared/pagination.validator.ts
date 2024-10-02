import { z } from "zod";

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

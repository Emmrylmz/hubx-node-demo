import { z } from "zod";

export const authorSchemaZod = z.object({
  name: z.string().min(1, { message: "Author name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  birthDate: z.union([z.string(), z.date()]), // Accept both string and Date types
});

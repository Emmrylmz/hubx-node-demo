// src/models/Author.ts
import { Schema, model, Document } from "mongoose";
import { z } from "zod";

export interface IAuthor extends Document {
  name: string;
  country: string;
  birthDate: Date;
}

export const authorSchema = new Schema<IAuthor>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  birthDate: { type: Date, required: true },
});

export const Author = model<IAuthor>("Author", authorSchema);

export const authorSchemaZod = z.object({
  name: z.string().min(1, { message: "Author name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  birthDate: z.union([z.string(), z.date()]), // Accept both string and Date types
});

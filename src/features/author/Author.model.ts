// src/models/Author.ts
import { Schema, model, Document } from "mongoose";

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


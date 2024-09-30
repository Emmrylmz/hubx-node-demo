// src/models/Author.ts
import { Schema, model, Document } from "mongoose";

// Define the interface for the Author document
export interface IAuthor extends Document {
  name: string;
  country: string;
  birthDate: Date;
}

// Create the schema for the Author document
const authorSchema = new Schema<IAuthor>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  birthDate: { type: Date, required: true },
});

// Export the Author model
export const Author = model<IAuthor>("Author", authorSchema);

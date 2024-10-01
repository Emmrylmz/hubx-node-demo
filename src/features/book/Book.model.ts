import { Schema, model, Document, isValidObjectId } from "mongoose";
import { z } from "zod";
import {  IAuthor, authorSchema } from "../author/Author.model.ts";
import { authorSchemaZod } from "../author/author.schema.zod.ts";
export interface IBook extends Document {
  title: string;
  price: number;
  isbn: string;
  language: string;
  numberOfPages: number;
  publisher: string;
  author: IAuthor;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  isbn: { type: String, required: true },
  language: { type: String, required: true },
  numberOfPages: { type: Number, required: true },
  publisher: { type: String, required: true },
  author: { type: authorSchema, required: true },
});

export const Book = model<IBook>("Book", bookSchema);

// DTO for creating a book



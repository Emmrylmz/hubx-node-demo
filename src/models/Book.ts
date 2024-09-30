import { Schema, model, Document } from "mongoose";
import { Author } from "./Author";
// Database Model
export interface IBook extends Document {
  title: string;
  price: number;
  isbn: string;
  language: string;
  numberOfPages: number;
  publisher: string;
  // author: Schema.Types.ObjectId; // Reference to Author
}
// DTO for creating a book (input type)
export interface CreateBookDto {
  title: string;
  price: number;
  isbn: string;
  language: string;
  numberOfPages: number;
  publisher: string;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  isbn: { type: String, required: true },
  language: { type: String, required: true },
  numberOfPages: { type: Number, required: true },
  publisher: { type: String, required: true },
  // author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
});

export const Book = model<IBook>("Book", bookSchema);

// DTO for successful book creation response
export interface CreateBookResponseDto {
  id: string;
  title: string;
  message: string;
}

// DTO for getting a book (might exclude some fields)
export interface GetBookDto {
  id: string;
  title: string;
  price: number;
  language: string;
  publisher: string;
  // Add other fields you want to expose
}

// DTO for listing books (might be a simplified version of GetBookDto)
export interface ListBookDto {
  id: string;
  title: string;
  price: number;
}

// DTO for updating a book
export interface UpdateBookDto {
  title?: string;
  price?: number;
  isbn?: string;
  language?: string;
  numberOfPages?: number;
  publisher?: string;
}

// DTO for successful book update response
export interface UpdateBookResponseDto {
  id: string;
  message: string;
}

// DTO for successful book deletion response
export interface DeleteBookResponseDto {
  id: string;
  message: string;
}

import { z } from "zod";

// Zod schema for IBook (Mongoose Schema)
export const bookSchemaZod = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required and cannot be empty" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  isbn: z.string().min(1, { message: "ISBN is required and cannot be empty" }),
  language: z
    .string()
    .min(1, { message: "Language is required and cannot be empty" }),
  numberOfPages: z
    .number()
    .min(1, { message: "Number of pages must be a positive number" }),
  publisher: z
    .string()
    .min(1, { message: "Publisher is required and cannot be empty" }),
});

export const createBookResponseSchema = z.object({
  id: z.string(), // Book ID
  title: z.string(), // Book title
  message: z.string(), // Success message
});

export const getBookDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  language: z.string(),
  publisher: z.string(),
  // Add other fields as needed, e.g., isbn, numberOfPages
});
export const listBookDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
});

export const updateBookSchemaZod = z.object({
  title: z.string().optional(),
  price: z.number().min(0).optional(),
  isbn: z.string().optional(),
  language: z.string().optional(),
  numberOfPages: z.number().min(1).optional(),
  publisher: z.string().optional(),
});

export const updateBookResponseSchema = z.object({
  id: z.string(), // Book ID
  message: z.string(), // Success message
});
export const deleteBookResponseSchema = z.object({
  id: z.string(), // Book ID
  message: z.string(), // Success message
});

export const bookIdSchemaZod = z
  .string()
  .min(1, "Book ID is required and cannot be empty.");

import { Schema, model, Document, Types } from "mongoose";
import { z } from "zod";
import { authorSchemaZod,  IAuthor, authorSchema } from "./Author.ts";

// Database Model
export interface IBook extends Document {
  title: string;
  price: number;
  isbn: string;
  language: string;
  numberOfPages: number;
  publisher: string;
  author: IAuthor; 
}
export interface CreateBookDto {
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

export interface CreateBookResponseDto {
  id: string;
  title: string;
  message: string;
}

export interface GetBookDto {
  id: string;
  title: string;
  price: number;
  language: string;
  publisher: string;
  author: IAuthor;
}

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

export interface UpdateBookResponseDto {
  id: string;
  message: string;
}

export interface DeleteBookResponseDto {
  id: string;
  message: string;
}

export const bookSchemaZod = z.object({
  // _id: z.union([z.string(), z.object()]),
  title: z.string().min(1, { message: "Title is required and cannot be empty" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  isbn: z.string().min(1, { message: "ISBN is required and cannot be empty" }),
  language: z.string().min(1, { message: "Language is required and cannot be empty" }),
  numberOfPages: z.number().min(1, { message: "Number of pages must be a positive number" }),
  publisher: z.string().min(1, { message: "Publisher is required and cannot be empty" }),
  author: authorSchemaZod, 
});


// Schema for pagination options
export const PaginationOptionsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().default('title'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});


// Schema for pagination info
export const PaginationInfoSchema = z.object({
  currentPage: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  totalItems: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean()
});

// Schema for the paginated result
export const PaginatedResultSchema = z.object({
  data: z.array(bookSchemaZod),
  pagination: PaginationInfoSchema
});

// Infer types from schemas
export type PaginationOptions = z.infer<typeof PaginationOptionsSchema>;
export type Book = z.infer<typeof bookSchemaZod>;
export type PaginationInfo = z.infer<typeof PaginationInfoSchema>;
export type PaginatedResult = z.infer<typeof PaginatedResultSchema>;

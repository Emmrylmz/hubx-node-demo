import { IAuthor } from "../author/Author.model.ts";
import { IBook } from "./Book.model.ts";

  
  // DTO for creating a book
  export interface CreateBookDto {
    title: string;
    price: number;
    isbn: string;
    language: string;
    numberOfPages: number;
    publisher: string;
    author: IAuthor;
  }
  
  // Response DTO for a successful book creation
  export interface CreateBookResponseDto {
    data: {
      id: string;
      title: string;
    };
    message: string;
  }
  
  // DTO for retrieving a book
  export interface GetBookDto {
    data: {
      id: string;
      title: string;
      price: number;
      language: string;
      publisher: string;
      author: IAuthor;
    };
    message: string;
  }
  
  // DTO for listing books (simplified book information)
  export interface ListBookDto {
    data: {
      id: string;
      title: string;
      price: number;
    }[];
    message: string;
    metadata: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
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
  
  // Response DTO for a successful book update
  export interface UpdateBookResponseDto {
    data: {
      id: string;
    };
    message: string;
  }
  
  // Response DTO for a successful book deletion
  export interface DeleteBookResponseDto {
    data: {
      id: string;
    };
    message: string;
  }
  
  // Response DTO for getting all books with pagination
  export interface GetAllBooksResponseDto {
    data: IBook[];
    message: string;
    metadata: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }
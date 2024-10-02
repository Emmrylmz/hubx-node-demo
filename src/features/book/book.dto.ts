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
  
  // Response DTO for crud operations
  export interface BookResponseDto {
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
  
  
  // DTO for updating a book
  export interface UpdateBookDto {
    title?: string;
    price?: number;
    isbn?: string;
    language?: string;
    numberOfPages?: number;
    publisher?: string;
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
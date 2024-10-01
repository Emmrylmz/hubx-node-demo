import {
    IBook,
    CreateBookResponseDto,
    GetBookDto,
    UpdateBookResponseDto,
    DeleteBookResponseDto,
    PaginatedResult,
  } from "../models/Book.ts";
  
  export class BookFactory {
    static createGetBookDto(book: IBook): GetBookDto {
      return {
        id: book._id.toString(),
        title: book.title,
        price: book.price,
        language: book.language,
        publisher: book.publisher,
        author: book.author,
      };
    }
  
    static createBookResponseDto(book: IBook): CreateBookResponseDto {
      return {
        id: book._id.toString(),
        title: book.title,
        message: "Book created successfully",
      };
    }
  
    static createUpdateBookResponseDto(book: IBook): UpdateBookResponseDto {
      return {
        id: book._id.toString(),
        message: "Book updated successfully",
      };
    }
  
    static createDeleteBookResponseDto(book: IBook): DeleteBookResponseDto {
      return {
        id: book._id.toString(),
        message: "Book deleted successfully",
      };
    }
  
    static createPaginatedResult(books: IBook[], totalCount: number, page: number, limit: number): PaginatedResult {
      return {
        data: books.map(book => this.createGetBookDto(book)),
        pagination: {
          totalItems: totalCount,
          currentPage: page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }
  }
import {
  CreateBookResponseDto,
  GetBookDto,
  UpdateBookResponseDto,
  DeleteBookResponseDto,
  GetAllBooksResponseDto,
} from "./book.dto.ts";
import { IBook } from "./Book.model.ts";

export class BookFactory {
  static createGetBookDto(book: IBook): GetBookDto {
    return {
      data: {
        id: book._id.toString(),
        title: book.title,
        price: book.price,
        language: book.language,
        publisher: book.publisher,
        author: book.author,
      },
      message: "Book retrieved successfully",
    };
  }

  static createBookResponseDto(book: IBook): CreateBookResponseDto {
    return {
      data: {
        id: book._id.toString(),
        title: book.title,
      },
      message: "Book created successfully",
    };
  }

  static createUpdateBookResponseDto(book: IBook): UpdateBookResponseDto {
    return {
      data: {
        id: book._id.toString(),
      },
      message: "Book updated successfully",
    };
  }

  static createDeleteBookResponseDto(book: IBook): DeleteBookResponseDto {
    return {
      data: {
        id: book._id.toString(),
      },
      message: "Book deleted successfully",
    };
  }

  static createListAllBooksResponseDto(
    books: IBook[],
    total: number,
    totalPages: number,
    page: number
  ): GetAllBooksResponseDto {
    return {
      data: books,
      message: "Books retrieved successfully",
      metadata: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: total,
      },
    };
  }
}

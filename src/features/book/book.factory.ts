import {
  BookResponseDto,
  GetBookDto,
  GetAllBooksResponseDto,
} from "./book.dto.ts";
import { IBook } from "./Book.model.ts";

/**
* The BookFactory class is a utility class that creates response data 
* and transfer objects (DTOs) for book-related operations
**/
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

  static createBookResponseDto(book: IBook): BookResponseDto {
    return {
      data: {
        id: book._id.toString(),
        title: book.title,
      },
      message: "Book created successfully",
    };
  }

  static createUpdateBookResponseDto(book: IBook): BookResponseDto {
    return {
      data: {
        id: book._id.toString(),
        title: book.title,
      },
      message: "Book updated successfully",
    };
  }

  static createDeleteBookResponseDto(book: IBook): BookResponseDto {
    return {
      data: {
        id: book._id.toString(),
        title: book.title,
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

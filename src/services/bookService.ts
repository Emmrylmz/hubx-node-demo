// src/services/BookService.ts

import { BookRepository } from "../repositories/bookRepository";
import { BookFactory } from "./bookFactory.ts";
import {
  NotFoundError,
  ValidationError,
} from "../errors/errors.ts";
import {
  IBook,
  CreateBookResponseDto,
  GetBookDto,
  UpdateBookDto,
  UpdateBookResponseDto,
  DeleteBookResponseDto,
  getAllBooksResponseDto,
} from "../models/Book";

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  public async getAllBooks(page: number, limit: number):Promise<getAllBooksResponseDto> {
    const { books, total, totalPages } = await this.bookRepository.getAllBooks(page, limit);

    if (books.length === 0 && total > 0) {
      throw new NotFoundError("No books found for the given page");
    }


    return BookFactory.createListAllBooksResponseDto(books, total, totalPages, page);
  }

  public async getBookById(bookId: string): Promise<GetBookDto> {
    const book = await this.bookRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return BookFactory.createGetBookDto(book);
  }

  public async createBook(bookData: IBook): Promise<CreateBookResponseDto> {
    const newBook = await this.bookRepository.addBook(bookData);
    return BookFactory.createBookResponseDto(newBook);
  }

  public async updateBook(
    bookId: string,
    bookData: UpdateBookDto
  ): Promise<UpdateBookResponseDto> {
    if (Object.keys(bookData).length === 0) {
      throw new ValidationError("Book data is required for update.");
    }
    const updatedBook = await this.bookRepository.updateBook(bookId, bookData);
    if (!updatedBook) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return BookFactory.createUpdateBookResponseDto(updatedBook);
  }

  public async deleteBook(bookId: string): Promise<DeleteBookResponseDto> {
    const deletedBook = await this.bookRepository.deleteBookById(bookId);
    if (!deletedBook) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return BookFactory.createDeleteBookResponseDto(deletedBook);
  }
}

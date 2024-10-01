// src/services/BookService.ts

import { BookRepository } from "../repositories/bookRepository";
import { BookFactory } from "./bookFactory.ts";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../errors/errors";
import {
  IBook,
  CreateBookResponseDto,
  GetBookDto,
  UpdateBookDto,
  UpdateBookResponseDto,
  DeleteBookResponseDto,
  PaginationOptions,
  PaginatedResult,
} from "../models/Book";

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  public async getAllBooks(
    options: PaginationOptions
  ): Promise<PaginatedResult> {
    try {
      const { books, totalCount } = await this.bookRepository.findAllBooks(options);
      return BookFactory.createPaginatedResult(books, totalCount, options.page, options.limit);
    } catch (error) {
      throw new DatabaseError(`Error fetching books: ${(error as Error).message}`);
    }
  }

  public async getBookById(bookId: string): Promise<GetBookDto> {
    const book = await this.bookRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return BookFactory.createGetBookDto(book);
  }

  public async createBook(bookData: IBook): Promise<CreateBookResponseDto> {
    try {
      const newBook = await this.bookRepository.addBook(bookData);
      return BookFactory.createBookResponseDto(newBook);
    } catch (error) {
      throw new DatabaseError(`Error creating new book: ${(error as Error).message}`);
    }
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
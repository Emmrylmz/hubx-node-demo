import { BookRepository } from "./book.repository.ts";
import { BookFactory } from "./book.factory.ts";
import { NotFoundError, ValidationError } from "../../errors/errors.ts";
import {
  BookResponseDto,
  GetBookDto,
  UpdateBookDto,
  GetAllBooksResponseDto,
} from "./book.dto.ts";
import { IBook } from "./Book.model.ts";

/**
 * Service class for managing book-related operations.
 */
export class BookService {
  /**
   * Creates an instance of BookService.
   * @param bookRepository - The repository for book data operations.
   */
  constructor(private bookRepository: BookRepository) {}

  /**
   * Retrieves a paginated list of all books.
   * @param page - The page number to retrieve.
   * @param limit - The number of books per page.
   * @returns A promise that resolves to the paginated list of books.
   * @throws {NotFoundError} If no books are found for the given page.
   */
  public async getAllBooks(
    page: number,
    limit: number
  ): Promise<GetAllBooksResponseDto> {
    const { books, total, totalPages } = await this.bookRepository.getAllBooks(
      page,
      limit
    );

    if (books.length === 0 && total === 0) {
      throw new NotFoundError("No books found for the given page");
    }

    return BookFactory.createListAllBooksResponseDto(
      books,
      total,
      totalPages,
      page
    );
  }

  /**
   * Retrieves a book by its ID.
   * @param bookId - The ID of the book to retrieve.
   * @returns A promise that resolves to the book data.
   * @throws {NotFoundError} If the book with the given ID is not found.
   */
  public async getBookById(bookId: string): Promise<GetBookDto> {
    const book = await this.bookRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return BookFactory.createGetBookDto(book);
  }

  /**
   * Creates a new book.
   * @param bookData - The data for the new book.
   * @returns A promise that resolves to the created book's data.
   */
  public async createBook(bookData: IBook): Promise<BookResponseDto> {
    const newBook = await this.bookRepository.addBook(bookData);
    return BookFactory.createBookResponseDto(newBook);
  }

  /**
   * Updates an existing book.
   * @param bookId - The ID of the book to update.
   * @param bookData - The new data for the book.
   * @returns A promise that resolves to the updated book's data.
   * @throws {ValidationError} If no book data is provided for the update.
   * @throws {NotFoundError} If the book with the given ID is not found.
   */
  public async updateBook(
    bookId: string,
    bookData: UpdateBookDto
  ): Promise<BookResponseDto> {
    if (Object.keys(bookData).length === 0) {
      throw new ValidationError("Book data is required for update.");
    }
    const updatedBook = await this.bookRepository.updateBook(bookId, bookData);
    if (!updatedBook) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return BookFactory.createUpdateBookResponseDto(updatedBook);
  }

  /**
   * Deletes a book by its ID.
   * @param bookId - The ID of the book to delete.
   * @returns A promise that resolves to the deleted book's data.
   * @throws {NotFoundError} If the book with the given ID is not found.
   */
  public async deleteBook(bookId: string): Promise<BookResponseDto> {
    const deletedBook = await this.bookRepository.deleteBookById(bookId);
    if (!deletedBook) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return BookFactory.createDeleteBookResponseDto(deletedBook);
  }
}

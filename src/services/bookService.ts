import { BookRepository } from "../repositories/bookRepository.ts";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../errors/errors.ts";
import {
  IBook,
  CreateBookResponseDto,
  GetBookDto,
  ListBookDto,
  UpdateBookDto,
  UpdateBookResponseDto,
  DeleteBookResponseDto,
  bookSchemaZod,
  CreateBookDto,
  createBookResponseSchema,
} from "../models/Book.ts";
import { validateObjectId } from "../utils/helper.ts";

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  // Get all books
  public async getAllBooks(): Promise<ListBookDto[]> {
    const books = await this.bookRepository.findAllBooks();
    if (!books || books.length === 0) {
      throw new NotFoundError("No books found.");
    }
    return books.map((book) => ({
      id: book._id.toString(),
      title: book.title,
      price: book.price,
    }));
  }

  // Get a book by ID
  public async getBookById(bookId: string): Promise<GetBookDto> {
    validateObjectId(bookId);
    const book = await this.bookRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundError(`Book with ID ${bookId} not found.`);
    }
    return {
      id: book._id.toString(),
      title: book.title,
      price: book.price,
      language: book.language,
      publisher: book.publisher,
      // Add other fields you want to expose
    };
  }

  // Create a new book
  public async createBook(
    bookData: CreateBookDto
  ): Promise<CreateBookResponseDto> {
    const parsed = bookSchemaZod.safeParse(bookData);

    if (!parsed.success) {
      throw new ValidationError("Validation failed enter required fields");
    }

    const validatedBookData = parsed.data as CreateBookDto; // This is the successfully validated data

    try {
      const newBook = await this.bookRepository.addBook(validatedBookData);

      const createResponse = {
        id: newBook._id.toString(),
        title: newBook.title,
        message: "Book created successfully",
      };

      return createBookResponseSchema.parse(
        createResponse
      ) as CreateBookResponseDto;
    } catch (error) {
      throw new DatabaseError(
        `Error creating new book: ${(error as Error).message}`
      );
    }
  }

  // Update a book by ID
  public async updateBook(
    bookId: string,
    bookData: UpdateBookDto
  ): Promise<UpdateBookResponseDto> {
    validateObjectId(bookId);
    if (Object.keys(bookData).length === 0) {
      throw new ValidationError("Book data is required for update.");
    }
    try {
      const updatedBook = await this.bookRepository.updateBook(
        bookId,
        bookData
      );
      if (!updatedBook) {
        throw new NotFoundError(`Book with ID ${bookId} not found.`);
      }
      return {
        id: updatedBook._id.toString(),
        message: "Book updated successfully",
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Error updating book with ID ${bookId}: ${(error as Error).message}`
      );
    }
  }

  // Delete a book by ID
  public async deleteBook(bookId: string): Promise<DeleteBookResponseDto> {
    validateObjectId(bookId);
    try {
      const deletedBook = await this.bookRepository.deleteBookById(bookId);
      if (!deletedBook) {
        throw new NotFoundError(`Book with ID ${bookId} not found.`);
      }
      return {
        id: deletedBook._id.toString(),
        message: "Book deleted successfully",
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        `Error deleting book with ID ${bookId}: ${(error as Error).message}`
      );
    }
  }
}

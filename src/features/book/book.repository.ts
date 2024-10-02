import { Book, IBook } from "./Book.model.ts";
import { CreateBookDto } from "./book.dto.ts";
import { DatabaseError } from "../../errors/errors.ts"; // Ensure this path is correct

export class BookRepository {
  /**
   * Retrieves all books with pagination.
   * 
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of books per page.
   * @returns {Promise<{ books: IBook[]; total: number; totalPages: number }>} - A promise that resolves with the books, total count, and total pages.
   * @throws {DatabaseError} If a database operation fails.
   */
  public async getAllBooks(
    page: number,
    limit: number
  ): Promise<{ books: IBook[]; total: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      const [books, total] = await Promise.all([
        Book.find().skip(skip).limit(limit).lean().exec(),
        Book.countDocuments(),
      ]);
      const totalPages = Math.ceil(total / limit);
      return { books, total, totalPages };
    } catch (error) {
      throw new DatabaseError("Failed to retrieve books from the database");
    }
  }

  /**
   * Finds a book by its ID.
   * 
   * @param {string} bookId - The ID of the book to retrieve.
   * @returns {Promise<IBook | null>} - A promise that resolves with the book or null if not found.
   * @throws {DatabaseError} If a database operation fails.
   */
  public async findBookById(bookId: string): Promise<IBook | null> {
    try {
      return await Book.findById(bookId).lean().exec();
    } catch (error) {
      throw new DatabaseError(`Failed to find book with ID ${bookId}`);
    }
  }

  /**
   * Adds a new book to the database.
   * 
   * @param {CreateBookDto} bookData - The data to create the book.
   * @returns {Promise<IBook>} - A promise that resolves with the created book.
   * @throws {DatabaseError} If a database operation fails.
   */
  public async addBook(bookData: CreateBookDto): Promise<IBook> {
    try {
      const newBook = new Book({
        ...bookData,
        author: {
          ...bookData.author,
          birthDate: new Date(bookData.author.birthDate),
        },
      });
      return await newBook.save();
    } catch (error) {
      throw new DatabaseError("Failed to add new book to the database");
    }
  }

  /**
   * Updates an existing book by its ID.
   * 
   * @param {string} bookId - The ID of the book to update.
   * @param {Partial<IBook>} bookData - The data to update the book with.
   * @returns {Promise<IBook | null>} - A promise that resolves with the updated book or null if not found.
   * @throws {DatabaseError} If a database operation fails.
   */
  public async updateBook(
    bookId: string,
    bookData: Partial<IBook>
  ): Promise<IBook | null> {
    try {
      return await Book.findByIdAndUpdate(
        bookId,
        { $set: bookData },
        { new: true }
      ).lean().exec();
    } catch (error) {
      throw new DatabaseError(`Failed to update book with ID ${bookId}`);
    }
  }

  /**
   * Deletes a book by its ID.
   * 
   * @param {string} bookId - The ID of the book to delete.
   * @returns {Promise<IBook | null>} - A promise that resolves with the deleted book or null if not found.
   * @throws {DatabaseError} If a database operation fails.
   */
  public async deleteBookById(bookId: string): Promise<IBook | null> {
    try {
      return await Book.findByIdAndDelete(bookId).lean().exec();
    } catch (error) {
      throw new DatabaseError(`Failed to delete book with ID ${bookId}`);
    }
  }
}

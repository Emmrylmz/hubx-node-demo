import { DatabaseError } from "../errors/errors.ts";
import {
  Book,
  CreateBookDto,
  IBook,
} from "../models/Book.ts";

export class BookRepository {
  // Find all books

  public async getAllBooks(
    page: number,
    limit: number
  ): Promise<{ books: IBook[]; total: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    try {
      const [books, total] = await Promise.all([
        Book.find().skip(skip).limit(limit).lean().exec(),
        Book.countDocuments(),
      ]);
      const totalPages = Math.ceil(total / limit);
      

      return { books, total, totalPages };
    } catch (error) {
      throw new DatabaseError(
        `Database error while fetching books: ${(error as Error).message}`
      );
    }
  }

  // Find a book by ID
  public async findBookById(bookId: string): Promise<IBook | null> {
    return await Book.findById(bookId);
  }

  // Add a new book
  public async addBook(bookData: CreateBookDto): Promise<IBook> {
    const parsedDate = new Date(bookData.author.birthDate);
    bookData.author.birthDate = parsedDate;
    const newBook = new Book(bookData); // Create a new instance of the Book model
    return await newBook.save(); // Save and return the new book
  }

  // Update a book by ID
  public async updateBook(
    bookId: string,
    bookData: Partial<IBook>
  ): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(
      bookId,
      { $set: bookData },
      { new: true }
    ).exec();
    // Returns the updated document or null if not found
  }

  // Delete a book by ID
  public async deleteBookById(bookId: string): Promise<IBook | null> {
    return await Book.findByIdAndDelete(bookId).exec(); // Return the deleted document or null if not found
  }
}

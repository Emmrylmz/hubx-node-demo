// src/repositories/BookRepository.ts

import { Book, CreateBookDto, IBook } from "../models/Book.ts"; // Import Mongoose model and interface

export class BookRepository {
  // Find all books
  public async findAllBooks(): Promise<IBook[]> {
    
    return await Book.find();
    // .populate('author').exec(); // Populate 'author' field if needed
  }

  // Find a book by ID
  public async findBookById(bookId: string): Promise<IBook | null> {
    return await Book.findById(bookId);
    // .populate('author').exec(); // Populate 'author' field
  }

  // Add a new book
  public async addBook(bookData: CreateBookDto): Promise<IBook> {
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

import {
  Book,
  CreateBookDto,
  IBook,
  PaginatedResult,
  PaginatedResultSchema,
  PaginationOptions,
  PaginationOptionsSchema,
} from "../models/Book.ts";

export class BookRepository {
  // Find all books

  public async findAllBooks(
    options: PaginationOptions
  ): Promise<PaginatedResult> {

    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;

    const sortOptions: { [key: string]: 1 | -1 } = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [books, total] = await Promise.all([
      Book.find({}).sort(sortOptions).skip(skip).limit(limit).exec(),
      Book.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);

    const result = {
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    console.log(result,"asdasd");

    // Validate the result
    return PaginatedResultSchema.parse(result);
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

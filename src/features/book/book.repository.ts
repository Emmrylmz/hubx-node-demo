import { DatabaseError } from "../../errors/errors.ts"
import {
  Book,
  IBook,
} from "./Book.model.ts"
import { CreateBookDto } from "./book.dto.ts"
export class BookRepository {

  public async getAllBooks(
    page: number,
    limit: number
  ): Promise<{ books: IBook[]; total: number, totalPages: number }> {
    const skip = (page - 1) * limit

    try {
      const [books, total] = await Promise.all([
        Book.find().skip(skip).limit(limit).lean().exec(),
        Book.countDocuments(),
      ]);
      const totalPages = Math.ceil(total / limit)

      return { books, total, totalPages }
    } catch (error) {
      throw new DatabaseError(
        `Database error while fetching books: ${(error as Error).message}`
      );
    }
  }

  public async findBookById(bookId: string): Promise<IBook | null> {
    return await Book.findById(bookId);
  }

  public async addBook(bookData: CreateBookDto): Promise<IBook> {
    const parsedDate = new Date(bookData.author.birthDate)
    bookData.author.birthDate = parsedDate
    const newBook = new Book(bookData)
    return await newBook.save(); 
  }

  public async updateBook(
    bookId: string,
    bookData: Partial<IBook>
  ): Promise<IBook | null> {
    return await Book.findByIdAndUpdate(
      bookId,
      { $set: bookData },
      { new: true }
    ).exec();
  }

  public async deleteBookById(bookId: string): Promise<IBook | null> {
    return await Book.findByIdAndDelete(bookId).exec() 
  }
}

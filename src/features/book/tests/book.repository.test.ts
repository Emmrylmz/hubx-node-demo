import { BookRepository } from "../book.repository.ts";
import { Book, IBook } from "../Book.model.ts";
import { DatabaseError } from "../../../errors/errors.ts";

jest.mock("../Book.model.ts");

describe("BookRepository", () => {
  let bookRepository: BookRepository;
  let mockBookModel: jest.Mocked<typeof Book>;

  beforeEach(() => {
    mockBookModel = Book as jest.Mocked<typeof Book>;
    bookRepository = new BookRepository();
  });

  describe("getAllBooks", () => {
    it("should return all books with pagination", async () => {
      const mockBooks = [
        { _id: "1", title: "Book 1" },
        { _id: "2", title: "Book 2" },
      ] as IBook[];
      mockBookModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBooks),
      } as any);
      mockBookModel.countDocuments.mockResolvedValue(2);

      const result = await bookRepository.getAllBooks(1, 10);

      expect(result).toEqual({ books: mockBooks, total: 2, totalPages: 1 });
      expect(mockBookModel.find).toHaveBeenCalled();
      expect(mockBookModel.countDocuments).toHaveBeenCalled();
    });

    it("should throw DatabaseError on failure", async () => {
      mockBookModel.find.mockImplementation(() => {
        throw new Error("Database error");
      });

      await expect(bookRepository.getAllBooks(1, 10)).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("findBookById", () => {
    it("should return a book when it exists", async () => {
      const mockBook = { _id: "1", title: "Book 1" };

      // Simulate Mongoose `findById` method resolving with a book
      (Book.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBook),
      });

      const result = await bookRepository.findBookById("1");

      expect(result).toEqual(mockBook);
      expect(Book.findById).toHaveBeenCalledWith("1");
    });

    it("should throw DatabaseError if there is a failure in finding a book", async () => {
      // Simulate Mongoose `findById` method throwing an error
      (Book.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database failure")),
      });

      await expect(bookRepository.findBookById("1")).rejects.toThrow(
        DatabaseError
      );
    });
  });

  describe("addBook", () => {
    it("should add a new book", async () => {
      const mockBook = {
        _id: "2",
        title: "Book 2",
        author: { birthDate: new Date() },
      } as IBook;
      mockBookModel.prototype.save.mockResolvedValue(mockBook);

      const result = await bookRepository.addBook(mockBook);

      expect(result).toEqual(mockBook);
      expect(mockBookModel.prototype.save).toHaveBeenCalled();
    });
  });

  describe("updateBook", () => {
    it("should update an existing book", async () => {
      const mockBook = { _id: "1", title: "Updated Book" } as IBook;

      // Mock the Mongoose method `findByIdAndUpdate` to return a chainable object
      (mockBookModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBook), // Simulate a resolved book update
      });

      const result = await bookRepository.updateBook("1", {
        title: "Updated Book",
      });

      // Assertions
      expect(result).toEqual(mockBook);
      expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { $set: { title: "Updated Book" } },
        { new: true }
      );
    });

    it("should throw DatabaseError if updating a book fails", async () => {
      // Mock the `findByIdAndUpdate` method to throw an error
      (mockBookModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database failure")), // Simulate failure
      });

      await expect(
        bookRepository.updateBook("1", { title: "Updated Book" })
      ).rejects.toThrow(DatabaseError); // Expect DatabaseError to be thrown
    });
  });

  describe("deleteBookById", () => {
    it("should delete an existing book", async () => {
      const mockBook = { _id: "1", title: "Book to Delete" } as IBook;

      // Mock the Mongoose `findByIdAndDelete` method
      (mockBookModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBook), // Simulate a successful delete operation
      });

      const result = await bookRepository.deleteBookById("1");

      // Assertions
      expect(result).toEqual(mockBook);
      expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("should throw DatabaseError if deleting a book fails", async () => {
      // Mock the `findByIdAndDelete` method to simulate an error
      (mockBookModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database failure")), // Simulate failure
      });

      // Expect the DatabaseError to be thrown
      await expect(bookRepository.deleteBookById("1")).rejects.toThrow(
        DatabaseError
      );
    });
  });
});

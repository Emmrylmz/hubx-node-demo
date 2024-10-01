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
      const mockBook = { _id: "1", title: "Book 1" } as IBook;
      mockBookModel.findById.mockResolvedValue(mockBook);

      const result = await bookRepository.findBookById("1");

      expect(result).toEqual(mockBook);
      expect(mockBookModel.findById).toHaveBeenCalledWith("1");
    });

    it("should return null when book does not exist", async () => {
      mockBookModel.findById.mockResolvedValue(null);

      const result = await bookRepository.findBookById("1");

      expect(result).toBeNull();
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
      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBook),
      } as any);

      const result = await bookRepository.updateBook("1", {
        title: "Updated Book",
      });

      expect(result).toEqual(mockBook);
      expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { $set: { title: "Updated Book" } },
        { new: true }
      );
    });
  });

  describe("deleteBookById", () => {
    it("should delete an existing book", async () => {
      const mockBook = { _id: "1", title: "Book to Delete" } as IBook;
      mockBookModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBook),
      } as any);

      const result = await bookRepository.deleteBookById("1");

      expect(result).toEqual(mockBook);
      expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith("1");
    });
  });
});

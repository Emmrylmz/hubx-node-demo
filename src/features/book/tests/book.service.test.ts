import { BookService } from "../book.service.ts";
import { BookRepository } from "../book.repository.ts";
import { BookFactory } from "../book.factory.ts";
import { NotFoundError, ValidationError } from "../../../errors/errors.ts";
import { IBook } from "../Book.model.ts";
import { UpdateBookDto } from "../book.dto.ts";
// Mock the BookRepository

jest.mock("../book.repository.ts");

describe("BookService", () => {
  let bookService: BookService;
  let mockBookRepository: jest.Mocked<BookRepository>;

  beforeEach(() => {
    mockBookRepository = new BookRepository() as jest.Mocked<BookRepository>;
    bookService = new BookService(mockBookRepository);
  });

  describe("getAllBooks", () => {
    it("should return all books when they exist", async () => {
      const mockBooks = [
        { _id: "1", title: "Book 1" },
        { _id: "2", title: "Book 2" },
      ] as IBook[];
      const mockResponse = { books: mockBooks, total: 2, totalPages: 1 };
      mockBookRepository.getAllBooks.mockResolvedValue(mockResponse);

      const result = await bookService.getAllBooks(1, 10);

      expect(result).toEqual(
        BookFactory.createListAllBooksResponseDto(mockBooks, 2, 1, 1)
      );
      expect(mockBookRepository.getAllBooks).toHaveBeenCalledWith(1, 10);
    });

    it("should throw NotFoundError when no books are found", async () => {
      mockBookRepository.getAllBooks.mockResolvedValue({
        books: [],
        total: 0,
        totalPages: 0,
      });

      await expect(bookService.getAllBooks(1, 10)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("getBookById", () => {
    it("should return a book when it exists", async () => {
      const mockBook = { _id: "1", title: "Book 1" } as IBook;
      mockBookRepository.findBookById.mockResolvedValue(mockBook);

      const result = await bookService.getBookById("1");

      expect(result).toEqual(BookFactory.createGetBookDto(mockBook));
      expect(mockBookRepository.findBookById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError when book does not exist", async () => {
      mockBookRepository.findBookById.mockResolvedValue(null);

      await expect(bookService.getBookById("1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("createBook", () => {
    it("should create a new book", async () => {
      const mockBook = { _id: "1", title: "New Book" } as IBook;
      mockBookRepository.addBook.mockResolvedValue(mockBook);

      const result = await bookService.createBook(mockBook);

      expect(result).toEqual(BookFactory.createBookResponseDto(mockBook));
      expect(mockBookRepository.addBook).toHaveBeenCalledWith(mockBook);
    });
  });

  describe("updateBook", () => {
    it("should update an existing book", async () => {
      const mockBook = { _id: "1", title: "Updated Book" } as IBook;
      const updateData: UpdateBookDto = { title: "Updated Book" };
      mockBookRepository.updateBook.mockResolvedValue(mockBook);

      const result = await bookService.updateBook("1", updateData);

      expect(result).toEqual(BookFactory.createUpdateBookResponseDto(mockBook));
      expect(mockBookRepository.updateBook).toHaveBeenCalledWith(
        "1",
        updateData
      );
    });

    it("should throw ValidationError when update data is empty", async () => {
      await expect(bookService.updateBook("1", {})).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw NotFoundError when book does not exist", async () => {
      mockBookRepository.updateBook.mockResolvedValue(null);

      await expect(
        bookService.updateBook("1", { title: "Updated Book" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteBook", () => {
    it("should delete an existing book", async () => {
      const mockBook = { _id: "1", title: "Book to Delete" } as IBook;
      mockBookRepository.deleteBookById.mockResolvedValue(mockBook);

      const result = await bookService.deleteBook("1");

      expect(result).toEqual(BookFactory.createDeleteBookResponseDto(mockBook));
      expect(mockBookRepository.deleteBookById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError when book does not exist", async () => {
      mockBookRepository.deleteBookById.mockResolvedValue(null);

      await expect(bookService.deleteBook("1")).rejects.toThrow(NotFoundError);
    });
  });
});

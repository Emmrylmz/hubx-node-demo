import { BookController } from "../book.controller.ts";
import { BookService } from "../book.service.ts";
import { Request, Response } from "express";
import { ValidationError, NotFoundError } from "../../../errors/errors.ts";
import {
  CreateBookResponseDto,
  GetAllBooksResponseDto,
  GetBookDto,
  UpdateBookResponseDto,
} from "../book.dto.ts";
import { IBook } from "src/features/book/Book.model.ts";
import { ZodError } from "zod";

// Mock the BookService and validators
jest.mock("../book.service.ts");

describe("BookController", () => {
  let bookController: BookController;
  let mockBookService: jest.Mocked<BookService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockBookService = new BookService({} as any) as jest.Mocked<BookService>;
    bookController = new BookController(mockBookService);
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("getAllBooks", () => {
    const mockBooks: IBook[] = [
      {
        id: "1",
        title: "Book 1",
        price: 10,
        language: "English",
        publisher: "Test Publisher",
        author: { name: "Author", country: "US", birthDate: new Date() },
        numberOfPages: 100,
        isbn: "123-456",
      },
      {
        id: "2",
        title: "Book 2",
        price: 15,
        language: "English",
        publisher: "Test Publisher",
        author: { name: "Author", country: "US" },
        numberOfPages: 150,
        isbn: "123-456",
      },
    ] as IBook[];

    const mockResponseDto: GetAllBooksResponseDto = {
      data: mockBooks,
      message: "Books fetched successfully",
      metadata: { currentPage: 1, totalPages: 1, totalItems: 2 },
    };

    beforeEach(() => {
      mockRequest.query = {};
      mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
    });

    const runMiddlewares = async (middlewares, req, res, next) => {
      for (const middleware of middlewares) {
        await middleware(req, res, next);
      }
    };

    it("should return all books", async () => {
      mockRequest.query = { page: "1", limit: "10" };
      mockBookService.getAllBooks.mockResolvedValue(mockResponseDto);

      // Run middlewares and controller
      await runMiddlewares(
        bookController.getAllBooks,
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assertions
      expect(mockBookService.getAllBooks).toHaveBeenCalledWith(1, 10);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResponseDto);
    });

    it("should handle invalid pagination parameters", async () => {
      mockRequest.query = { page: "invalid", limit: "invalid" };

      // Run middlewares and controller
      await runMiddlewares(
        bookController.getAllBooks,
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(expect.any(ZodError));
    });
  });

  describe("getBookById", () => {
    const mockBook: GetBookDto = {
      data: {
        id: "1",
        title: "Book 1",
        price: 10,
        language: "English",
        publisher: "Test Publisher",
        author: { name: "Author", country: "US" },
      },
      message: "Book fetched successfully",
    } as GetBookDto;

    beforeEach(() => {
      mockRequest.params = {};
      mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
    });

    const runMiddlewares = async (middlewares, req, res, next) => {
      for (const middleware of middlewares) {
        await middleware(req, res, next);
      }
    };

    it("should return a book when it exists", async () => {
      mockRequest.params = { id: "1" };
      mockBookService.getBookById.mockResolvedValue(mockBook);

      // Run middlewares and controller
      await runMiddlewares(
        bookController.getBookById,
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assertions
      expect(mockBookService.getBookById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });

    it("should handle NotFoundError", async () => {
      mockRequest.params = { id: "1" };
      mockBookService.getBookById.mockRejectedValue(
        new NotFoundError("Book not found")
      );

      // Run middlewares and controller
      await runMiddlewares(
        bookController.getBookById,
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assertions
      expect(mockBookService.getBookById).toHaveBeenCalledWith("1");
      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe("createBook", () => {
    const mockBook: CreateBookResponseDto = {
      data: {
        id: "1",
        title: "New Book",
      },
      message: "Book created successfully",
    };

    beforeEach(() => {
      mockRequest.body = {
        title: "New Book",
        price: 10,
        isbn: "123-456",
        language: "English",
        numberOfPages: 100,
        publisher: "Test Publisher",
        author: { name: "Author", country: "US" },
      };
      mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
    });

    const runMiddlewares = async (middlewares, req, res, next) => {
      for (const middleware of middlewares) {
        await middleware(req, res, next);
      }
    };

    it("should create a new book", async () => {
      mockBookService.createBook.mockResolvedValue(mockBook);

      // Run middlewares and controller
      await runMiddlewares(
        bookController.createBook,
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assertions
      expect(mockBookService.createBook).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });
  });

  describe("updateBook", () => {
    const mockBook: UpdateBookResponseDto = {
      data: { id: "1" },
      message: "Book updated successfully",
    };

    beforeEach(() => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { title: "Updated Book" };
      mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
    });

    const runMiddlewares = async (middlewares, req, res, next) => {
      for (const middleware of middlewares) {
        await middleware(req, res, next);
      }
    };

    it("should update an existing book", async () => {
      mockBookService.updateBook.mockResolvedValue(mockBook);

      // Run middlewares and controller
      await runMiddlewares(
        bookController.updateBook,
        mockRequest,
        mockResponse,
        mockNext
      );

      // Assertions
      expect(mockBookService.updateBook).toHaveBeenCalledWith(
        "1",
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockBook);
    });
  });
});

import { Request, Response, NextFunction } from "express";
import { BookService } from "./book.service.ts";
import { validateRequest } from "../../middlewares/validateRequest.ts";
import { createBookSchemaZod, updateBookSchemaZod } from "./book.schema.zod.ts";
import { paginationQueryParamsZod } from "../../shared/validators/pagination.validator.ts";
import { ObjectIdValidationZod } from "../../shared/validators/objectId.validator.ts";

/**
 * Controller class for handling book-related HTTP requests.
 * Request Validation: The validateRequest middleware validates the query parameters using a Zod schema to ensure input is valid.
 */
export class BookController {
  /**
   * Creates an instance of BookController.
   * @param {BookService} bookService - The book service to handle business logic.
   */
  constructor(private bookService: BookService) {}

  /**
   * Handles GET request to retrieve all books with pagination.
   */
  public getAllBooks = [
    validateRequest({ query: paginationQueryParamsZod }),

    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await this.bookService.getAllBooks(page, limit);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Handles GET request to retrieve a book by its ID.
   */
  public getBookById = [
    validateRequest({ params: ObjectIdValidationZod }),

    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const book = await this.bookService.getBookById(req.params.id);
        res.status(200).json(book);
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Handles POST request to create a new book.
   */
  public createBook = [
    validateRequest({ body: createBookSchemaZod }),

    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const newBook = await this.bookService.createBook(req.body);
        res.status(201).json(newBook);
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Handles PUT request to update an existing book.
   */
  public updateBook = [
    validateRequest({
      params: ObjectIdValidationZod,
      body: updateBookSchemaZod,
    }),
  
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const updatedBook = await this.bookService.updateBook(
          req.params.id,
          req.body
        );
        res.status(200).json(updatedBook);
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Handles DELETE request to remove a book.
   */
  public deleteBook = [
    validateRequest({ params: ObjectIdValidationZod }),
 
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const response = await this.bookService.deleteBook(req.params.id);
        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    },
  ];
}
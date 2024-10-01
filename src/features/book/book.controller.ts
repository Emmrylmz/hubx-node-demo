import { Request, Response, NextFunction } from "express";
import { BookService } from "./book.service.ts";
import { ValidationError } from "../../errors/errors.ts";
import { validateRequest } from "../../middlewares/validateRequest.ts";
import {
  createBookSchemaZod,
  ObjectIdValidationZod,
  paginationQueryParamsZod,
  updateBookSchemaZod,
} from "./book.schema.zod.ts";

export class BookController {
  constructor(private bookService: BookService) {}

  public getAllBooks = [
    validateRequest({ query: paginationQueryParamsZod }),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
          throw new ValidationError("Invalid pagination parameters");
        }

        const result = await this.bookService.getAllBooks(page, limit);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  ];

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

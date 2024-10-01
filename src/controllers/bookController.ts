// src/controllers/BookController.ts

import { Request, Response, NextFunction } from "express";
import { BookService } from "../services/bookService.ts";
import { validateObjectId } from "../utils/helper.ts";
import { ZodError } from "zod";
import { ValidationError } from "../errors/errors.ts";

export class BookController {
  constructor(private bookService: BookService) {}

  public getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as "asc" | "desc",
      };
      const result = await this.bookService.getAllBooks(queryParams);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError("Invalid query parameters"));
      } else {
        next(error);
      }
    }
  };

  public getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      validateObjectId(req.params.id);
      const book = await this.bookService.getBookById(req.params.id);
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  };

  public createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newBook = await this.bookService.createBook(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      next(error);
    }
  };

  public updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      validateObjectId(req.params.id);
      const updatedBook = await this.bookService.updateBook(req.params.id, req.body);
      res.status(200).json(updatedBook);
    } catch (error) {
      next(error);
    }
  };

  public deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      validateObjectId(req.params.id);
      const response = await this.bookService.deleteBook(req.params.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
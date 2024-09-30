// src/controllers/BookController.ts

import { Request, Response } from "express";
import { BookService } from "../services/bookService.ts";

export class BookController {
  constructor(private bookService: BookService) {}

  public getAllBooks = async (req: Request, res: Response) => {
    try {
      const books = await this.bookService.getAllBooks();
      res.json(books);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public getBookById = async (req: Request, res: Response) => {
    try {
      const book = await this.bookService.getBookById(req.params.id);
      if (!book) {
        res.status(404).json({ message: "Book not found" });
      } else {
        res.json(book);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public createBook = async (req: Request, res: Response) => {
    try {
      const newBook = await this.bookService.createBook(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public updateBook = async (req: Request, res: Response) => {
    try {
      const updatedBook = await this.bookService.updateBook(
        req.params.id,
        req.body
      );
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  public deleteBook = async (req: Request, res: Response) => {
    try {
      await this.bookService.deleteBook(req.params.id);
      res.status(204).send(); // No Content
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

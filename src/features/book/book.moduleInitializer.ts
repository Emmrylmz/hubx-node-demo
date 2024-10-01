// Import necessary components
import { Router } from "express";
import { BookRepository } from "./book.repository.ts";
import { BookService } from "./book.service.ts";
import { BookController } from "./book.controller.ts";
import { createBookRouter } from "./book.router.ts";

export const initializeBookModule = (): Router => {
  // Initialize Repository
  const bookRepository = new BookRepository();

  // Initialize Service
  const bookService = new BookService(bookRepository);

  // Initialize Controller
  const bookController = new BookController(bookService);

  // Initialize Routes
  const bookRouter = createBookRouter(bookController);

  return bookRouter;
};

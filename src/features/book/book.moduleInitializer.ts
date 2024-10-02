// Import necessary components
import { Router } from "express";
import { BookRepository } from "./book.repository.ts";
import { BookService } from "./book.service.ts";
import { BookController } from "./book.controller.ts";
import { createBookRouter } from "./book.router.ts";

/**
 * Initializes the Book module, creating a new Router
 * instance with the necessary routes. The routes
 * are created by calling createBookRouter, which
 * takes an instance of BookController as an
 * argument. The BookController requires an
 * instance of BookService as an argument, which
 * requires an instance of BookRepository as an
 * argument.
 *
 * @returns {Router} The initialized Router
 */
export const initializeBookModule = (): Router => {
  const bookRepository = new BookRepository();
  const bookService = new BookService(bookRepository);
  const bookController = new BookController(bookService);
  const bookRouter = createBookRouter(bookController);

  return bookRouter;
};

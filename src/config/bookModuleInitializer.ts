// Import necessary components
import { Router } from 'express';
import { Db } from 'mongodb';
import { BookRepository } from '../repositories/bookRepository.ts';
import { BookService } from '../services/bookService.ts';
import { BookController } from '../controllers/bookController.ts';
import { createBookRouter } from '../routes/bookRouter.ts';

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

// src/routes/bookRoutes.ts

import { Router } from 'express';
import { BookController } from '../controllers/bookController';

export const createBookRouter = (bookController: BookController): Router => {
  const router = Router();

  router.get('/get_all_books', bookController.getAllBooks);
  router.get('/get_book/:id', bookController.getBookById);
  router.post('/create_book', bookController.createBook);
  router.put('/update_book/:id', bookController.updateBook);
  router.delete('/delte_book/:id', bookController.deleteBook);

  return router;
};

// src/routes/bookRoutes.ts

import { Router } from 'express';
import { BookController } from '../controllers/bookController.ts';
import { validateRequest } from '../middlewares/validateRequest.ts';
import { bookSchemaZod, PaginationOptionsSchema } from '../models/Book.ts';

export const createBookRouter = (bookController: BookController): Router => {
  const router = Router();

  router.get('/get_all_books',validateRequest(PaginationOptionsSchema) ,bookController.getAllBooks);
  router.get('/get_book/:id', bookController.getBookById);
  router.post('/create_book',validateRequest(bookSchemaZod) ,bookController.createBook);
  router.put('/update_book/:id', bookController.updateBook);
  router.delete('/delete_book/:id', bookController.deleteBook);

  return router;
};

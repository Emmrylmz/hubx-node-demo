// src/routes/bookRoutes.ts

import { Router } from "express";
import { BookController } from "./book.controller.ts";



/**
 * Creates a new Router with all the routes for the BookController.
 * @param bookController The BookController instance to use for the routes.
 * @returns The Router instance with the routes.
 */
export const createBookRouter = (bookController: BookController): Router => {
  const router = Router();

  router.get("/get_all_books", bookController.getAllBooks);
  router.get("/get_book/:id", bookController.getBookById);
  router.post("/create_book", bookController.createBook);
  router.put("/update_book/:id", bookController.updateBook);
  router.delete("/delete_book/:id", bookController.deleteBook);

  return router;
};

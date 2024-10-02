import express, { Express } from "express";
import http from "http";
import { mongoInstance } from "./config/MongoDB.ts";
import { initializeBookModule } from "./features/book/book.moduleInitializer.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import logger from "./utils/logger.ts";

/**
 * Main application class that sets up the Express server and manages its lifecycle.
 */
export class App {
  /** The Express application instance */
  public app: Express;
  /** The HTTP server instance */
  public server: http.Server;
  /** The port number on which the server will listen */
  public port: number;

  /**
   * Creates an instance of App.
   * @param {number} port - The port number for the server to listen on.
   */
  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
  }

  /**
   * Configures middleware for the Express application.
   * @private
   */
  private configureMiddleware(): void {
    this.app.use(express.json());
    this.initialize_routes();
    this.app.use(errorHandler.handle);
  }

  /**
   * Initializes and sets up routes for the application.
   * @private
   */
  private initialize_routes(): void {
    const bookRouter = initializeBookModule();
    this.app.use("/api/books", bookRouter);
  }

  /**
   * Starts the application server and establishes database connection.
   * @public
   * @returns {Promise<void>}
   * @throws Will exit the process with status 1 if startup fails.
   */
  public async start(): Promise<void> {
    try {
      logger.info("Starting application...");

      await mongoInstance.start();

      logger.info("MongoDB connection established.");

      this.initialize_routes();

      this.server = http.createServer(this.app);
      this.server.listen(this.port, () => {
        logger.info(`Server is running on port ${this.port}`);
      });
    } catch (error) {
      logger.error("Error during startup:", error);
      process.exit(1);
    }
  }

  /**
   * Gracefully shuts down the application server and closes database connection.
   * @public
   * @returns {Promise<void>}
   * @throws Will exit the process with status 1 if shutdown encounters an error.
   */
  public async shutdown(): Promise<void> {
    logger.info("Shutting down gracefully...");

    if (this.server) {
      this.server.close(async (err) => {
        if (err) {
          logger.error("Error shutting down server:", err);
          process.exit(1);
        }

        await mongoInstance.shutdown();
        logger.info("MongoDB connection closed.");

        process.exit(0);
      });
    }
  }
}

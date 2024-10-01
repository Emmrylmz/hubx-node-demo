import express, { Express } from "express";
import http from "http";
import { mongoInstance } from "./config/database.ts";
import { initializeBookModule } from "./features/book/book.moduleInitializer.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import logger from "./utils/logger.ts";

export class App {
  public app: Express;
  public server: http.Server;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
  }

  // Middleware configuration
  private configureMiddleware(): void {
    this.app.use(express.json());
    this.initialize_routes();
    this.app.use(errorHandler.handle);
  }

  private initialize_routes(): void {
    const bookRouter = initializeBookModule();
    this.app.use("/api/books", bookRouter);
  }

  // Graceful startup function
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
  // Graceful shutdown function
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

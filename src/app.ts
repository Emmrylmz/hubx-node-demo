import express, { Express } from "express";
import http from "http";
import { mongoInstance } from "./config/database.ts";
import { initializeBookModule } from "./config/bookModuleInitializer.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import bodyParser from "body-parser";

export class App {
  public app: Express;
  public server: http.Server;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    // Initialize MongoDB with the URI and database name

    this.configureMiddleware();
  }

  // Middleware configuration
  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(errorHandler.handle)
    this.app.use(bodyParser.json());

  }

  private initialize_routes(): void {
    const bookRouter = initializeBookModule();
    this.app.use("/api/books", bookRouter);
  }

  // Graceful startup function
  public async start(): Promise<void> {
    try {
      console.log("Starting application...");

      await mongoInstance.start();
      
      console.log("MongoDB connection established.");
      
      this.initialize_routes()
      
      

      // Start the Express server
      this.server = http.createServer(this.app);
      this.server.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`);
      });
    } catch (error) {
      console.error("Error during startup:", error);
      process.exit(1); // Exit if the startup fails
    }
  }

  // Graceful shutdown function
  public async shutdown(): Promise<void> {
    console.log("Shutting down gracefully...");

    if (this.server) {
      this.server.close(async (err) => {
        if (err) {
          console.error("Error shutting down server:", err);
          process.exit(1);
        }

        // Shut down MongoDB connection
        await mongoInstance.shutdown();
        console.log("MongoDB connection closed.");

        process.exit(0);
      });
    }
  }
}

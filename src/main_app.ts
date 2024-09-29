// src/main_app.ts

import express, { Express } from "express";
import http from "http";
import { query, startPool, shutdownPool } from "./config/database.ts"; // Importing the pool and query function

export class App {
  public app: Express;
  public server: http.Server;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.configureMiddleware();
    this.configureRoutes();
  }

  // Middleware configuration
  private configureMiddleware(): void {
    this.app.use(express.json());
    
  }

  // Application routes
  private configureRoutes(): void {
    // Example route: Get all users
    this.app.get("/users", async (req, res) => {
      try {
        const result = await query("SELECT * FROM users");
        res.json(result.rows); // Return the result of the query
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
      }
    });

    // Another route: Add a user
    this.app.post("/users", async (req, res) => {
      const { name, email } = req.body;
      try {
        const result = await query(
          "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
          [name, email]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Failed to add user" });
      }
    });
  }

  // Graceful startup function
  public async start(): Promise<void> {
    try {
      console.log("Starting application...");

      // Start the Express server
      await startPool();
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

        // Close the PostgreSQL connection pool
        await shutdownPool()
        console.log("PostgreSQL connection pool closed.");

        process.exit(0);
      });
    }
  }
}

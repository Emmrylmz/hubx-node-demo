// src/index.ts

import { App } from "./app.ts";

const PORT = 3000
const MONGO_URI = process.env.MONGO_URI
const DB_NAME = process.env.DB_NAME

const app = new App(PORT);

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log("Received shutdown signal...");
  await app.shutdown();
};

// Handle termination signals
process.on("SIGINT", gracefulShutdown);  // Ctrl + C in terminal
process.on("SIGTERM", gracefulShutdown); // Docker or other stop signals

// Start the application
app.start();    

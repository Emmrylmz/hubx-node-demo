// src/index.ts

import { App } from "./main_app.ts";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Instantiate the App class
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

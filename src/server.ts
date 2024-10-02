
import { App } from "./app.ts";

const PORT = 3000

const app = new App(PORT);

// Graceful shutdown handler
const gracefulShutdown = async () => {
  console.log("Received shutdown signal...");
  await app.shutdown();
};

process.on("SIGINT", gracefulShutdown);  
process.on("SIGTERM", gracefulShutdown); 

app.start();    

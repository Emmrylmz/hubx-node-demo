import mongoose, { Connection } from 'mongoose';

export class MongoDB {
  private uri: string;
  private dbName: string;
  private connection: Connection | null = null;
  private retryInterval: number = 5000; // Retry connection every 5 seconds if failed

  constructor(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
  }

  // Start Mongoose connection
  public async start(): Promise<void> {
    try {
      await mongoose.connect(this.uri, {
        dbName: this.dbName,
        maxPoolSize: 10, // Similar to max pool size in MongoClient
      });
      this.connection = mongoose.connection;

      this.connection.on('connected', () => {
        console.log(`Mongoose connected to database: ${this.dbName}`);
      });

      this.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
      });

      this.connection.on('disconnected', () => {
        console.log('Mongoose connection disconnected');
      });
    } catch (err) {
      console.error(`Mongoose connection failed. Retrying in ${this.retryInterval / 1000} seconds...`, err);
      setTimeout(() => this.start(), this.retryInterval);
    }
  }

  // Shutdown Mongoose connection
  public async shutdown(): Promise<void> {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        console.log("Mongoose connection closed.");
      }
    } catch (err) {
      console.error("Error shutting down Mongoose connection", err);
      throw err;
    }
  }

  // Get the mongoose connection
  public getConnection(): Connection {
    if (!this.connection) {
      throw new Error("Mongoose connection not initialized");
    }
    return this.connection;
  }
}

// Singleton instance of MongoDB
export const mongoInstance = new MongoDB(
  process.env.MONGO_URI || 'mongodb://localhost:27017',
  process.env.DB_NAME || 'testdb'
);

// Function to ensure the instance is initialized
export const getMongoInstance = async (): Promise<MongoDB> => {
  if (!mongoInstance) {
    throw new Error("MongoDB instance not initialized");
  }

  if (!mongoInstance.getConnection()) {
    await mongoInstance.start(); // Ensure Mongoose is connected
  }

  return mongoInstance;
};

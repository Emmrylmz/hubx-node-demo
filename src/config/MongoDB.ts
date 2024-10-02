import mongoose, { Connection } from 'mongoose';

/**
 * Class representing a MongoDB connection manager.
 */
export class MongoDB {
  private uri: string;
  private dbName: string;
  private connection: Connection | null = null;
  private retryInterval: number = 5000; // 5 seconds

  /**
   * Creates an instance of MongoDB.
   * @param {string} uri - The MongoDB connection URI.
   * @param {string} dbName - The name of the database to connect to.
   */
  constructor(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
  }

  /**
   * Starts the Mongoose connection to MongoDB.
   * @public
   * @returns {Promise<void>}
   * @throws Will retry connection after a delay if it fails.
   */
  public async start(): Promise<void> {
    try {
      await mongoose.connect(this.uri, {
        dbName: this.dbName,
        maxPoolSize: 10, // Arbitrary value
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

  /**
   * Gracefully shuts down the Mongoose connection.
   * @public
   * @returns {Promise<void>}
   * @throws Will throw an error if shutdown fails.
   */
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

  /**
   * Retrieves the current Mongoose connection.
   * @public
   * @returns {Connection} The current Mongoose connection.
   * @throws Will throw an error if the connection is not initialized.
   */
  public getConnection(): Connection {
    if (!this.connection) {
      throw new Error("Mongoose connection not initialized");
    }
    return this.connection;
  }
}

/**
 * Singleton instance of MongoDB.
 * @type {MongoDB}
 */
export const mongoInstance = new MongoDB(
  process.env.MONGO_URI,
  process.env.DB_NAME 
);

/**
 * Retrieves the singleton MongoDB instance, ensuring it's connected.
 * @async
 * @function getMongoInstance
 * @returns {Promise<MongoDB>} The MongoDB instance.
 * @throws Will throw an error if the MongoDB instance is not initialized.
 */
export const getMongoInstance = async (): Promise<MongoDB> => {
  if (!mongoInstance) {
    throw new Error("MongoDB instance not initialized");
  }

  if (!mongoInstance.getConnection()) {
    await mongoInstance.start(); 
  }

  return mongoInstance;
};
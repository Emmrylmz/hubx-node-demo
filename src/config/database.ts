import pkg from "pg";
const { Pool } = pkg;

// PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",     // or 'postgres' if in Docker
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydb",
  port: 5432,
  max: 10,                // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Time to wait for a connection before throwing an error
});

// Start the pool by testing the connection
export async function startPool(): Promise<void> {
  try {
    // Test the connection by executing a simple query
    await pool.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed", err);
    throw err;
  }
}

// Gracefully shut down the connection pool
export async function shutdownPool(): Promise<void> {
  try {
    await pool.end(); // This closes all active connections
    console.log("Database connection pool closed.");
  } catch (err) {
    console.error("Error shutting down the database pool", err);
    throw err;
  }
}

// Function to query the database
export async function query(text: string, params?: any[]): Promise<any> {
  const start = Date.now();  // For performance monitoring
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch (err) {
    console.error("Query error", err);
    throw err;
  } finally {
    client.release();  // Release the client back to the pool
  }
}

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const useSsl = Boolean(
  process.env.DATABASE_URL?.includes("render.com") ||
    process.env.PGSSLMODE === "require" ||
    process.env.NODE_ENV === "production"
);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

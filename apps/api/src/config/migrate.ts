import { pool } from "./database";

async function migrate() {
  const client = await pool.connect();

  try {
    console.info("Running migrations...");

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS customers (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name   VARCHAR(150) NOT NULL,
        cpf         CHAR(11)     NOT NULL UNIQUE,
        email       VARCHAR(200) NOT NULL UNIQUE,
        favorite_color VARCHAR(10) NOT NULL,
        observations TEXT         NOT NULL DEFAULT '',
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_customers_cpf   ON customers(cpf);
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
    `);

    console.info("Migrations completed successfully.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

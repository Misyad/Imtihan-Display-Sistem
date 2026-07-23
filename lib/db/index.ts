// @ts-nocheck
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDrizzle = globalThis as unknown as {
  conn: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString || "postgresql://user:password@localhost:5432/imtihan",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.conn = pool;
}

export const db = drizzle(pool, { schema });

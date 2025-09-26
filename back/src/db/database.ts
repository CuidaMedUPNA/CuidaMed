import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./types";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

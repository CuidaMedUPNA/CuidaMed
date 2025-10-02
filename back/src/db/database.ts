import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./types";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DB_URI,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

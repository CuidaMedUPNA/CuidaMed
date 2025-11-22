import { beforeAll, afterAll, vi } from "vitest";
import { Kysely, PostgresDialect } from "kysely";
import { newDb } from "pg-mem";
import type { FastifyInstance } from "fastify";
import { Database } from "../src/db/types";
import { createTestDB } from "./utils/seedTestDB.js";

process.env.JWT_SECRET =
  "your_super_secret_key_that_is_at_least_32_characters_long_for_secure_jwt_signing_purposes_12345";

const mem = newDb({
  autoCreateForeignKeyIndices: true,
});
const pgMem = mem.adapters.createPg();

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pgMem.Pool(),
  }),
});

vi.mock("../src/db/database", () => ({ db }));

let app: FastifyInstance;

beforeAll(async () => {
  process.env.DISABLE_AUTH = "true";
  await createTestDB(db);

  const { buildTestApp } = await import("./test-app.js");
  app = await buildTestApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await db.destroy();
});

export { app, db };

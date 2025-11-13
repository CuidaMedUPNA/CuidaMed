import { beforeAll, afterAll, vi } from "vitest";
import { Kysely, PostgresDialect } from "kysely";
import { newDb } from "pg-mem";
import type { FastifyInstance } from "fastify";
import { Database } from "../src/db/types";
import { createTestDB } from "./utils/seedTestDB.js";

/*
  Mock de DB en memoria
*/
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

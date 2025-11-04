import { beforeAll, afterAll, vi } from "vitest";
import { Kysely, SqliteDialect } from "kysely";
import DatabaseDriver from "better-sqlite3";
import { Database } from "../src/db/types";
import { buildTestApp } from "../src/app.test";

// Create an in-memory SQLite database for testing
const sqlite = new Kysely<Database>({
  dialect: new SqliteDialect({ database: new DatabaseDriver(":memory:") }),
});

vi.mock("../src/db/database", () => ({ db: sqlite }));

let app: Awaited<ReturnType<typeof buildTestApp>>;

beforeAll(async () => {
  app = await buildTestApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await sqlite.destroy();
});

export { app, sqlite as db };

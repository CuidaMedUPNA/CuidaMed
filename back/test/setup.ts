import { beforeAll, afterAll, vi } from "vitest";
import { Kysely, SqliteDialect, sql } from "kysely";
import DatabaseDriver from "better-sqlite3";
import { Database } from "../src/db/types";
import type { FastifyInstance } from "fastify";

// Configurar la base de datos en memoria y la aplicación Fastify antes de las pruebas
const sqlite = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: new DatabaseDriver(":memory:"),
  }),
});

vi.mock("../src/db/database", () => ({ db: sqlite }));

let app: FastifyInstance;

beforeAll(async () => {

  await sql`PRAGMA foreign_keys = ON;`.execute(sqlite);
  
  await sqlite.schema
    .createTable("user")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("name", "text")
    .addColumn("email", "text")
    .addColumn("password", "text")
    .execute();

  await sqlite.schema
    .createTable("medicine")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("trade_name", "text")
    .execute();

  await sqlite.schema
    .createTable("treatment")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade")
    )
    .addColumn("start_date", "text", (col) => col.notNull())
    .addColumn("end_date", "text")
    .execute();

  await sqlite.schema
    .createTable("medicine_ingredient")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("medicine_id", "integer", (col) =>
      col.references("medicine.id").onDelete("cascade")
    )
    .addColumn("ingredient_name", "text")
    .addColumn("concentration_amount", "integer")
    .addColumn("concentration_unit", "text")
    .execute();

  await sqlite.schema
    .createTable("dosing_schedule")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("medicine_id", "integer", (col) =>
      col.references("medicine.id").onDelete("cascade")
    )
    .addColumn("treatment_id", "integer", (col) =>
      col.references("treatment.id").onDelete("cascade")
    )
    .addColumn("start_date", "text")
    .addColumn("end_date", "text")
    .addColumn("dose_amount", "integer")
    .addColumn("dose_unit", "text")
    .execute();

  await sqlite.schema
    .createTable("dosing_time")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("dosing_schedule_id", "integer", (col) =>
      col.references("dosing_schedule.id").onDelete("cascade")
    )
    .addColumn("scheduled_time", "text")
    .addColumn("day_of_week", "integer")
    .execute();

  const { buildTestApp } = await import("../src/app.test");
  
  app = await buildTestApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await sqlite.destroy();
});

export { app, sqlite as db };

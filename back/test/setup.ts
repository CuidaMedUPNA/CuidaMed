import { beforeAll, afterAll, vi } from "vitest";
import { Kysely, PostgresDialect } from "kysely";
import { newDb } from "pg-mem";
import type { FastifyInstance } from "fastify";
import { Database } from "../src/db/types";

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
  
  await db.schema
    .createTable("user")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar")
    .addColumn("email", "varchar")
    .addColumn("password", "varchar")
    .execute();

  await db.schema
    .createTable("medicine")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("trade_name", "varchar")
    .execute();

  await db.schema
    .createTable("treatment")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade"),
    )
    .addColumn("start_date", "varchar", (col) => col.notNull())
    .addColumn("end_date", "varchar")
    .execute();

  await db.schema
    .createTable("medicine_ingredient")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("medicine_id", "integer", (col) =>
      col.references("medicine.id").onDelete("cascade"),
    )
    .addColumn("ingredient_name", "varchar")
    .addColumn("concentration_amount", "integer")
    .addColumn("concentration_unit", "varchar")
    .execute();

  await db.schema
    .createTable("dosing_schedule")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("medicine_id", "integer", (col) =>
      col.references("medicine.id").onDelete("cascade"),
    )
    .addColumn("treatment_id", "integer", (col) =>
      col.references("treatment.id").onDelete("cascade"),
    )
    .addColumn("start_date", "varchar")
    .addColumn("end_date", "varchar")
    .addColumn("dose_amount", "integer")
    .addColumn("dose_unit", "varchar")
    .execute();

  await db.schema
    .createTable("dosing_time")
    .ifNotExists()
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("dosing_schedule_id", "integer", (col) =>
      col.references("dosing_schedule.id").onDelete("cascade"),
    )
    .addColumn("scheduled_time", "varchar")
    .addColumn("day_of_week", "integer")
    .execute();

  const { buildTestApp } = await import("./test-app.js");
  app = await buildTestApp();
  await app.ready();

});

afterAll(async () => {
  await app.close();
  await db.destroy();
});

export { app, db };

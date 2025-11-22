import { Insertable } from "kysely";
import { db } from "../setup";
import { Kysely } from "kysely";
import { Database } from "../../src/db/types";
import jwt from "jsonwebtoken";

export async function createTestDB(db: Kysely<Database>) {
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
    .addColumn("start_date", "date", (col) => col.notNull())
    .addColumn("end_date", "date")
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
    .addColumn("start_date", "date")
    .addColumn("end_date", "date")
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
}


export async function insertUser(
  overrides: Partial<Insertable<Database['user']>> = {}
) {
    const defaultUser: Insertable<Database['user']> = {
        name: "user",
        email: "user@example.com",
        password: "secret",
    };

    const [user] = await db
        .insertInto("user")
        .values({ ...defaultUser, ...overrides })
        .returning(["id"])
        .execute();

    return user;
}

export async function insertMedicine(
    overrides: Partial<Insertable<Database['medicine']>> = {}
) {
    const [medicine] = await db
        .insertInto("medicine")
        .values({
        trade_name: "Paracetamol",
        ...overrides,
        })
        .returning(["id"])
        .execute();
    return medicine;
}

export async function insertMedicineIngredient(
    overrides: Partial<Insertable<Database['medicine_ingredient']>> = {}
) {
    const [ingredient] = await db
        .insertInto("medicine_ingredient")
        .values({
            medicine_id: 1,
            ingredient_name: "Acetaminofén",
            concentration_amount: 500,
            concentration_unit: "mg",
            ...overrides,
        })
        .returning(["id"])
        .execute();
    return ingredient;
}

export async function insertTreatment(
    overrides: Partial<Insertable<Database['treatment']>> = {}
) {
    const [treatment] = await db
        .insertInto("treatment")
        .values({
            name: "Tratamiento generico",
            user_id: 1,
            start_date: "2025-01-01",
            end_date: null,
            ...overrides,
        })
        .returning(["id"])
        .execute();
    return treatment;
}

export async function insertDosingSchedule(
    overrides: Partial<Insertable<Database['dosing_schedule']>> = {}
) {
    const [schedule] = await db
        .insertInto("dosing_schedule")
        .values({
            medicine_id: 1,
            treatment_id: 1,
            start_date: "2025-01-01",
            end_date: null,
            dose_amount: 1,
            dose_unit: "comprimido",
            ...overrides,
        })
        .returning(["id"])
        .execute();
    return schedule;
}

export async function insertDosingTime(
    overrides: Partial<Insertable<Database['dosing_time']>> = {}
) {
    const [time] = await db
        .insertInto("dosing_time")
        .values({
            dosing_schedule_id: 1,
            scheduled_time: "20:00",
            ...overrides,
        })
        .returning(["id"])
        .execute();
    return time;
}

export async function seedDefaultTestDB() {
    await insertUser();
    await insertMedicine();
    await insertMedicineIngredient();
    await insertTreatment();
    await insertDosingSchedule();
    await insertDosingTime();
}

export async function clearTestDB() {
    await db.deleteFrom("dosing_time").execute();
    await db.deleteFrom("dosing_schedule").execute();
    await db.deleteFrom("treatment").execute();
    await db.deleteFrom("medicine_ingredient").execute();
    await db.deleteFrom("medicine").execute();
    await db.deleteFrom("user").execute();
}

export function generateTestToken(userId: number, email: string): string {
    const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_that_is_at_least_32_characters_long_for_secure_jwt_signing_purposes_12345";
    
    return jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: "24h" }
    );
}


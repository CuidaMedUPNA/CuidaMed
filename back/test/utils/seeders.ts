import { Insertable } from "kysely";
import type {
    DosingScheduleTable,
    DosingTimeTable,
    MedicineTable,
    TreatmentTable,
    UserTable
} from "../../src/db/types";
import { db } from "../setup";

export async function insertUser(
  overrides: Partial<Insertable<UserTable>> = {}
) {
    const defaultUser: Insertable<UserTable> = {
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
    overrides: Partial<Insertable<MedicineTable>> = {}
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
    overrides: Partial<Insertable<MedicineTable>> = {}
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
    overrides: Partial<Insertable<TreatmentTable>> = {}
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
    overrides: Partial<Insertable<DosingScheduleTable>> = {}
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
    overrides: Partial<Insertable<DosingTimeTable>> = {}
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

export async function seedDatabase() {
    await insertUser();
    await insertMedicine();
    await insertMedicineIngredient();
    await insertTreatment();
    await insertDosingSchedule();
    await insertDosingTime();
}

export async function clearDatabase() {
    await db.deleteFrom("dosing_time").execute();
    await db.deleteFrom("dosing_schedule").execute();
    await db.deleteFrom("treatment").execute();
    await db.deleteFrom("medicine_ingredient").execute();
    await db.deleteFrom("medicine").execute();
    await db.deleteFrom("user").execute();
}



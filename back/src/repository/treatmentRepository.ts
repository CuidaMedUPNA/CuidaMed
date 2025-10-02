import { db } from "../db/database";
import { NewTratamiento } from "../db/types";

export async function insertTreatment(treatment: NewTratamiento) {
  return await db
    .insertInto("treatments")
    .values(treatment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTreatmentsByUserId(userId: number) {
  return await db
    .selectFrom("tratamientos")
    .selectAll()
    .where("id_usuario", "=", userId)
    .execute();
}

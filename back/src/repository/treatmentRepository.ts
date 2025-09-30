import { db } from "../db/database";
import { NewTratamiento } from "../db/types";

export async function createTreatment(treatment: NewTratamiento) {
  return await db
    .insertInto("tratamientos")
    .values(treatment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

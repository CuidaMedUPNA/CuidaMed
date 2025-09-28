import { db } from "../db/database";
import { NewTratamiento } from "../db/types";

export async function newTreatment(treatment: NewTratamiento) {
  console.log("Tratamiento a insertar: " + JSON.stringify(treatment));
  return await db
    .insertInto("tratamientos")
    .values(treatment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

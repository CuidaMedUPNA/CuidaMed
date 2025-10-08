import { db } from "../db/database";
import { NewMedicineTreatment } from "../db/types";

export async function insertMedicineTreatment(treatment: NewMedicineTreatment) {
  return await db
    .insertInto("medicine_treatment")
    .values(treatment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

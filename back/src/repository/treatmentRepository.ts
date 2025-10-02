import { db } from "../db/database";
import { NewTreatment } from "../db/types";

export async function insertTreatment(treatment: NewTreatment) {
  return await db
    .insertInto("treatment")
    .values(treatment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTreatmentsByUserId(userId: number) {
  return await db
    .selectFrom("treatment")
    .selectAll()
    .where("user_id", "=", userId)
    .execute();
}

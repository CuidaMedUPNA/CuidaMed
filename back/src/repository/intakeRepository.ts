import { db } from "../db/database";
import { NewIntake } from "../db/types";

export async function insertIntake(intake: NewIntake) {
  return await db
    .insertInto("intake")
    .values(intake)
    .returningAll()
    .executeTakeFirstOrThrow();
}

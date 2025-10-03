import { db } from "../db/database";
import { NewTreatment } from "../db/types";
import { Treatment } from "@cuidamed-api/server";

export async function insertTreatment(treatment: NewTreatment) {
  return await db
    .insertInto("treatment")
    .values(treatment)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTreatmentsByUserId(userId: number) {
  const today = new Date();

  const treatments = await db
    .selectFrom("treatment")
    .selectAll()
    .where("user_id", "=", userId)
    .where("end_date", ">", today)
    .where("start_date", "<=", today)
    .execute();

  const treatmentsWithDates: Treatment[] = treatments.map((treatment) => ({
    name: treatment.name,
    userId: treatment.user_id,
    id: treatment.id,
    startDate: treatment.start_date?.toDateString() || "",
    endDate: treatment.end_date?.toDateString() || "",
  }));

  return treatmentsWithDates;
}

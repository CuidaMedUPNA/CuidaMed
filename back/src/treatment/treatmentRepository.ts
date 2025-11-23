import { db } from "../db/database";
import { NewTreatment, TreatmentUpdate } from "../db/types";
import { Treatment } from "@cuidamed-api/server";

export async function insertTreatment(treatment: NewTreatment) {
  const insertedTreatment = await db
    .insertInto("treatment")
    .values(treatment)
    .returningAll()
    .executeTakeFirstOrThrow();

  return {
    id: insertedTreatment.id,
    name: insertedTreatment.name,
    userId: insertedTreatment.user_id,
    startDate: insertedTreatment.start_date.toISOString().split("T")[0],
    endDate: insertedTreatment.end_date?.toISOString().split("T")[0],
  };
}

export async function getTreatmentsByUserId(userId: number) {
  const today = new Date();

  const treatments = await db
    .selectFrom("treatment")
    .selectAll()
    .where("user_id", "=", userId)
    .where("start_date", "<=", today)
    .where((eb) =>
      eb.or([eb("end_date", ">", today), eb("end_date", "is", null)])
    )
    .execute();

  const treatmentsWithDates: Treatment[] = treatments.map((treatment) => ({
    name: treatment.name,
    userId: userId,
    id: treatment.id,
    startDate: treatment.start_date?.toISOString().split("T")[0] || "",
    endDate: treatment.end_date?.toISOString().split("T")[0] || "",
  }));

  return treatmentsWithDates;
}

export async function getTreatmentById(treatmentId: number) {
  const treatment = await db
    .selectFrom("treatment")
    .selectAll()
    .where("id", "=", treatmentId)
    .executeTakeFirst();

  if (!treatment) {
    return null;
  }

  return {
    id: treatment.id,
    name: treatment.name,
    userId: treatment.user_id,
    startDate: treatment.start_date.toISOString().split("T")[0],
    endDate: treatment.end_date?.toISOString().split("T")[0],
  };
}

export async function updateTreatmentById(
  treatmentId: number,
  treatmentData: TreatmentUpdate
) {
  const newData: TreatmentUpdate = {
    name: treatmentData.name,
    start_date: treatmentData.start_date,
    end_date: treatmentData.end_date ?? null,
  };

  const result = await db
    .updateTable("treatment")
    .set(newData)
    .where("id", "=", treatmentId)
    .executeTakeFirst();

  return result.numUpdatedRows;
}

export async function deleteTreatmentByTreatmentId(treatmentId: number) {
  const result = await db
    .deleteFrom("treatment")
    .where("id", "=", treatmentId)
    .executeTakeFirst();

  return result.numDeletedRows || 0;
}

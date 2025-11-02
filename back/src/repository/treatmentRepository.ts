import { db } from "../db/database";
import { NewTreatment } from "../db/types";
import { NewDosingSchedule, Treatment } from "@cuidamed-api/server";

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

const normalizeTime = (time: string): string => {
  const parts = time.split(":");
  if (parts.length === 2) {
    return `${time}:00`;
  }
  return time;
};

export async function insertIntakeToTreatment(
  dosingSchedule: NewDosingSchedule
) {
  const insertedSchedule = await db
    .insertInto("dosing_schedule")
    .values({
      medicine_id: dosingSchedule.medicineId,
      treatment_id: dosingSchedule.treatmentId,
      start_date: dosingSchedule.startDate,
      end_date: dosingSchedule.endDate ?? null,
      dose_amount: dosingSchedule.doseAmount,
      dose_unit: dosingSchedule.doseUnit,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const dbDosingTimes = dosingSchedule.dosingTimes.map((time) => ({
    dosing_schedule_id: insertedSchedule.id,
    scheduled_time: normalizeTime(time.scheduledTime),
    day_of_week: (time.dayOfWeek ?? null) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | null,
  }));

  await db.insertInto("dosing_time").values(dbDosingTimes).execute();

  return insertedSchedule;
}

export async function deleteIntakeFromTreatment(
  treatmentId: number,
  intakeId: number
) {
  const result = await db
    .deleteFrom("dosing_schedule")
    .where("treatment_id", "=", treatmentId)
    .where("id", "=", intakeId)
    .executeTakeFirst();

  return result.numDeletedRows || 0;
}

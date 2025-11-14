import { db } from "../db/database";
import { NewDosingSchedule, DosingSchedule } from "@cuidamed-api/server";

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

export async function getIntakesByTreatmentId(treatmentId: number) {
  const dosingSchedules = await db
    .selectFrom("dosing_schedule")
    .innerJoin("medicine", "dosing_schedule.medicine_id", "medicine.id")
    .select([
      "dosing_schedule.id",
      "dosing_schedule.medicine_id",
      "dosing_schedule.treatment_id",
      "dosing_schedule.start_date",
      "dosing_schedule.end_date",
      "dosing_schedule.dose_amount",
      "dosing_schedule.dose_unit",
      "medicine.trade_name",
    ])
    .where("dosing_schedule.treatment_id", "=", treatmentId)
    .execute();

  const intakes: DosingSchedule[] = await Promise.all(
    dosingSchedules.map(async (schedule) => {
      const dosingTimes = await getDosingTimesByScheduleId(schedule.id);
      return {
        id: schedule.id,
        medicineId: schedule.medicine_id,
        medicineName: schedule.trade_name,
        treatmentId: schedule.treatment_id,
        startDate: formatDate(schedule.start_date),
        endDate: formatDate(schedule.end_date),
        doseAmount: schedule.dose_amount,
        doseUnit: schedule.dose_unit,
        dosingTimes: dosingTimes,
      };
    })
  );

  return intakes;
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

async function getDosingTimesByScheduleId(scheduleId: number) {
  const dosingTimes = await db
    .selectFrom("dosing_time")
    .selectAll()
    .where("dosing_schedule_id", "=", scheduleId)
    .execute();

  return dosingTimes.map((time) => {
    const [hours, minutes] = time.scheduled_time.split(":");
    return {
      id: time.id,
      dosingScheduleId: time.dosing_schedule_id,
      scheduledTime: `${hours}:${minutes}`,
      dayOfWeek: time.day_of_week,
    };
  });
}

const normalizeTime = (time: string): string => {
  const parts = time.split(":");
  if (parts.length === 2) {
    return `${time}:00`;
  }
  return time;
};

function formatDate(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.split("T")[0];
  if (value instanceof Date) return value.toISOString().split("T")[0];
  return String(value);
}

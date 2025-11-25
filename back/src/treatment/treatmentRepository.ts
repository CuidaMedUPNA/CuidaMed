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

interface ScheduledIntake {
  medicineName: string;
  doseAmount: number;
  doseUnit: string;
}

export async function getScheduledIntakesForNow(): Promise<
  Map<number, ScheduledIntake[]>
> {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // Formato HH:mm

  // Convertir getDay() a formato BD: 0 (dom) -> 7, 1 (lun) -> 1, etc.
  let dayOfWeek = now.getDay();
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

  const intakes = await db
    .selectFrom("dosing_time")
    .innerJoin(
      "dosing_schedule",
      "dosing_time.dosing_schedule_id",
      "dosing_schedule.id"
    )
    .innerJoin("medicine", "dosing_schedule.medicine_id", "medicine.id")
    .innerJoin("treatment", "dosing_schedule.treatment_id", "treatment.id")
    .select([
      "treatment.user_id",
      "medicine.trade_name as medicineName",
      "dosing_schedule.dose_amount as doseAmount",
      "dosing_schedule.dose_unit as doseUnit",
    ])
    .where("dosing_time.scheduled_time", "=", currentTime)
    .where((eb) =>
      eb.or([
        eb("dosing_time.day_of_week", "is", null),
        eb(
          "dosing_time.day_of_week",
          "=",
          dayOfWeek as 1 | 2 | 3 | 4 | 5 | 6 | 7
        ),
      ])
    )
    .where((eb) =>
      eb.and([
        eb("dosing_schedule.start_date", "<=", now),
        eb.or([
          eb("dosing_schedule.end_date", "is", null),
          eb("dosing_schedule.end_date", ">=", now),
        ]),
      ])
    )
    .execute();

  // Agrupar por userId
  const grouped = new Map<number, ScheduledIntake[]>();
  for (const intake of intakes) {
    if (!grouped.has(intake.user_id)) {
      grouped.set(intake.user_id, []);
    }
    grouped.get(intake.user_id)!.push({
      medicineName: intake.medicineName,
      doseAmount: Number(intake.doseAmount),
      doseUnit: intake.doseUnit,
    });
  }

  return grouped;
}

export async function getUserDevices(userId: number) {
  const devices = await db
    .selectFrom("user_device")
    .select(["firebase_token", "platform", "device_id"])
    .where("user_id", "=", userId)
    .execute();

  return devices;
}

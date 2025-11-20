import { RouteHandlers } from "@cuidamed-api/server";
import { db } from "../db/database";
import {
  deleteIntakeFromTreatment,
  getIntakesByTreatmentId,
  insertIntakeToTreatment,
} from "./intakeRepository";

export const intakeHandlers: Partial<RouteHandlers> = {
  createIntake: async (request, reply) => {
    try {
      const dosingSchedule = request.body;
      const insertedSchedule = await insertIntakeToTreatment(dosingSchedule);

      const insertedTimes = await db
        .selectFrom("dosing_time")
        .selectAll()
        .where("dosing_schedule_id", "=", insertedSchedule.id)
        .execute();

      const medicine = await db
        .selectFrom("medicine")
        .select("trade_name")
        .where("id", "=", insertedSchedule.medicine_id)
        .executeTakeFirstOrThrow();

      const response = {
        id: insertedSchedule.id,
        medicineId: insertedSchedule.medicine_id,
        medicineName: medicine.trade_name,
        treatmentId: insertedSchedule.treatment_id,
        startDate: new Date(insertedSchedule.start_date)
          .toISOString()
          .split("T")[0],
        endDate: insertedSchedule.end_date
          ? new Date(insertedSchedule.end_date).toISOString().split("T")[0]
          : undefined,
        doseAmount: insertedSchedule.dose_amount,
        doseUnit: insertedSchedule.dose_unit,
        dosingTimes: insertedTimes.map((time) => {
          const [hours, minutes] = time.scheduled_time.split(":");
          return {
            id: time.id,
            dosingScheduleId: time.dosing_schedule_id,
            scheduledTime: `${hours}:${minutes}`,
            dayOfWeek: time.day_of_week,
          };
        }),
      };

      return reply.status(201).send(response);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  getIntakesByTreatment: async (request, reply) => {
    try {
      const treatmentId = Number(request.params.treatmentId);
      const intakes = await getIntakesByTreatmentId(treatmentId);
      return reply.status(200).send(intakes);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  deleteIntake: async (request, reply) => {
    try {
      const rowsDeleted = await deleteIntakeFromTreatment(
        request.params.treatmentId,
        request.params.intakeId
      );

      if (rowsDeleted === 0) {
        return reply.status(404).send({ error: "Intake not found" });
      }
      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },
};

import { RouteHandlers } from "@cuidamed-api/server";
import { NewTreatment } from "./db/types";
import {
  insertTreatment,
  getTreatmentsByUserId,
  insertIntakeToTreatment,
} from "./repository/treatmentRepository";

export const handlers: RouteHandlers = {
  healthCheck: async (request, reply) => {
    await reply.status(200).send({ status: "ok" });
  },

  createTreatment: async (request, reply) => {
    const treatment = request.body;

    const newTreatment: NewTreatment = {
      name: treatment.name,
      user_id: Number(treatment.userId),
      start_date: treatment.startDate,
      end_date: treatment.endDate,
    };

    await insertTreatment(newTreatment);
    await reply.status(200).send(treatment);
  },

  getTreatments: async (request, reply) => {
    const userId = request.query.userId;

    const treatments = await getTreatmentsByUserId(userId);

    await reply.status(200).send(treatments);
  },

  createIntake: async (request, reply) => {
    const dosingSchedule = request.body;

    const insertedSchedule = await insertIntakeToTreatment(dosingSchedule);

    const response = {
      id: insertedSchedule.id,
      medicineId: insertedSchedule.medicine_id,
      treatmentId: insertedSchedule.treatment_id,
      startDate: insertedSchedule.start_date.toISOString().split("T")[0],
      endDate: insertedSchedule.end_date?.toISOString().split("T")[0],
      doseAmount: insertedSchedule.dose_amount,
      doseUnit: insertedSchedule.dose_unit,
      dosingTimes: dosingSchedule.dosingTimes,
    };

    await reply.status(201).send(response);
  },
  getIntakesByTreatment: async (request, reply) => {
    Number(request.params.treatmentId);
    reply.status(200).send([]);
  },
  deleteIntake: async (request, reply) => {
    Number(request.params.treatmentId);
    Number(request.params.intakeId);
    reply.status(204).send();
  },
};

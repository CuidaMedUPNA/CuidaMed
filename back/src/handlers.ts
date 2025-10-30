import { RouteHandlers } from "@cuidamed-api/server";
import { NewTreatment } from "./db/types";
import {
  insertTreatment,
  getTreatmentsByUserId,
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
      start_date: new Date(treatment.startDate),
      end_date: new Date(treatment.endDate),
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
    const treatmentId = Number(request.params.treatmentId);
    const dosingSchedule = request.body;

    // TODO: Validar que el tratamiento existe
    // TODO: Insertar dosing_schedule en BD
    // TODO: Insertar dosing_times en BD
    // TODO: Retornar el DosingSchedule creado con ID
    interface DosingTimeInput {
      scheduledTime: string;
      dayOfWeek?: number | null;
    }

    const response = {
      id: 1,
      medicineId: dosingSchedule.medicineId,
      treatmentId: treatmentId,
      startDate: dosingSchedule.startDate,
      endDate: dosingSchedule.endDate,
      doseAmount: dosingSchedule.doseAmount,
      doseUnit: dosingSchedule.doseUnit,
      dosingTimes: (dosingSchedule.dosingTimes as DosingTimeInput[]).map(
        (time: DosingTimeInput, index: number) => ({
          id: index + 1,
          dosingScheduleId: 1,
          scheduledTime: time.scheduledTime,
          dayOfWeek: time.dayOfWeek,
        })
      ),
    };

    await reply.status(201).send(response);
  },
  getIntakesByTreatment: async (request, reply) => {},
};

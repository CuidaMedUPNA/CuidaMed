import { RouteHandlers } from "@cuidamed-api/server";
import { NewTreatment, NewMedicineTreatment } from "./db/types";
import {
  insertTreatment,
  getTreatmentsByUserId,
} from "./repository/treatmentRepository";
import { insertMedicineTreatment } from "./repository/medicineTreatmentRepository";

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

  createMedicineTreatment: async (request, reply) => {
    const medicineTreatment = request.body;

    const newMedicineTreatment: NewMedicineTreatment = {
      medicine_id: medicineTreatment.medicineId,
      treatment_id: medicineTreatment.treatmentId
    };

    await insertMedicineTreatment(newMedicineTreatment);
    await reply.status(200).send(medicineTreatment);
  }
};

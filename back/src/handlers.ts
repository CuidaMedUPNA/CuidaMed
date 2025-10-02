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

    console.log("Nuevo tratamiento: ", treatment);

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
};

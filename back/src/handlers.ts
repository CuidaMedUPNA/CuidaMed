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
    };

    await insertTreatment(newTreatment);
    await reply.status(200).send(treatment);
  },
  getTreatments: async (request, reply) => {
    const userId = request.query.userId;

    console.log("User ID: ", userId);

    const treatments = await getTreatmentsByUserId(userId);

    console.log("Tratamientos: ", treatments);
  },
};

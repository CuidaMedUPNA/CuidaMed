import { RouteHandlers, User } from "@cuidamed-api/server";
import { NewTratamiento } from "./db/types";
import { insertTreatment } from "./repository/treatmentRepository";

export const handlers: RouteHandlers = {
  getUsers: async (request, reply) => {
    const users: User[] = [
      { id: "1", name: "Usuario1", email: "usuario1@gmail.com" },
    ];
    await reply.status(200).send(users);
  },
  healthCheck: async (request, reply) => {
    await reply.status(200).send({ status: "ok" });
  },
  getMedicationTake: async (request, reply) => {
    const medicationTake = {
      medicationId: "med1",
      time: new Date().toISOString(),
      status: "taken",
    } as const;

    await reply.status(200).send(medicationTake);
  },
  createTreatment: async (request, reply) => {
    const treatment = request.body;

    const newTreatment: NewTratamiento = {
      nombre: treatment.name,
      id_usuario: Number(treatment.userId),
    };

    await insertTreatment(newTreatment);
    await reply.status(200).send(treatment);
  },
};

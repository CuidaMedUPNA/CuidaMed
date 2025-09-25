import { RouteHandlers } from "@cuidamed-api/server";

export const handlers: RouteHandlers = {
  getUsers: async (request, reply) => {
    const users = [{ id: "1", name: "Usuario1", email: "usuario1@gmail.com" }];
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
};

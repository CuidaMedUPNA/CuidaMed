import { RouteHandlers } from "@cuidamed-api/server";

export const authHandler: Partial<RouteHandlers> = {
  registerUser: async (request, reply) => {
    reply.status(201).send();
  },

  login: async (request, reply) => {
    return reply.status(200).send();
  },
};

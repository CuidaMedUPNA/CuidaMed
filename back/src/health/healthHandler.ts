import { RouteHandlers } from "@cuidamed-api/server";

export const healthHandlers: Partial<RouteHandlers> = {
  healthCheck: async (request, reply) => {
    await reply.status(200).send({ status: "ok" });
  },
};

import "dotenv/config";
import Fastify from "fastify";
import { handlers } from "./handlers";
import openapiGlue from "fastify-openapi-glue";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";

const fastify = Fastify({ logger: true });

const path = require("path");
const options = {
  specification: path.resolve(__dirname, "../../api/openapi.yaml"),
  service: handlers,
};
fastify.register(openapiGlue, options);
fastify.register(fastifyCors, { origin: "*" });
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../../docs"),
});

fastify.get("/documentation", async (request, reply) => {
  return reply.type("text/html").sendFile("/api.html");
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

import "dotenv/config";
import Fastify from "fastify";
import { handlers } from "./handlers";
import openapiGlue from "fastify-openapi-glue";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({ logger: true });

const path = require("path");
const options = {
  specification: path.resolve(__dirname, "../../api/openapi.yaml"),
  service: handlers,
};
fastify.register(openapiGlue, options);
fastify.register(fastifyCors, { origin: "*" });

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

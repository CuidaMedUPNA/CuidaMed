import Fastify from "fastify";
import { handlers } from "./handlers";
import openapiGlue from "fastify-openapi-glue";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to build and return a Fastify app instance for testing
export async function buildTestApp() {
  const app = Fastify({ logger: false });

  const options = {
    specification: path.resolve(__dirname, "../../api/openapi.yaml"),
    service: handlers,
  };

  app.register(openapiGlue, options);
  app.register(fastifyCors, { origin: "*" });
  app.register(fastifyStatic, {
    root: path.join(__dirname, "../../docs"),
  });

  app.get("/documentation", async (request, reply) => {
    return reply.type("text/html").sendFile("/api.html");
  });

  return app;
}

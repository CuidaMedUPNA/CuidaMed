// src/app.test.ts
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

/**
 * Construye una instancia de Fastify para pruebas sin iniciar el servidor.
 */
export async function buildTestApp() {
  const app = Fastify({ logger: false });

  const options = {
    specification: path.resolve(__dirname, "../../api/openapi.yaml"),
    serviceHandlers: handlers,
  };

  await app.register(openapiGlue, options);
  await app.register(fastifyCors, { origin: "*" });
  await app.register(fastifyStatic, {
    root: path.join(__dirname, "../../docs"),
  });

  app.get("/documentation", async (_, reply) =>
    reply.type("text/html").sendFile("/api.html")
  );

  return app;
}

import Fastify from "fastify";
import { handlers } from "../src/handlers";
import openapiGlue from "fastify-openapi-glue";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authMiddleware } from "../src/middleware/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Instancia de Fastify para pruebas sin iniciar el servidor.
 */
export async function buildTestApp() {
  const app = Fastify({ logger: false });

  app.addHook("preHandler", async (request, reply) => {
    const publicPaths = ["/login", "/register", "/health", "/documentation"];

    if (!publicPaths.includes(request.url)) {
      await authMiddleware(request, reply);
    }
  });

  const options = {
    specification: path.resolve(__dirname, "../../api/openapi/bundled.yaml"),
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

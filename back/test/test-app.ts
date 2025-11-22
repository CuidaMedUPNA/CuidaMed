import Fastify from "fastify";
import { handlers } from "../src/handlers";
import openapiGlue from "fastify-openapi-glue";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Instancia de Fastify para pruebas sin iniciar el servidor.
 */
export async function buildTestApp() {
  const app = Fastify({ logger: false });

  if (process.env.DISABLE_AUTH === "true") {
    app.addHook("onRequest", (req, reply, done) => {
      const auth = req.headers.authorization;

      if (!auth) {
        req.user = undefined;
        return done();
      }

      req.user = {
        userId: 1,
        email: "test@example.com",
      };

      done();
    });
  }

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

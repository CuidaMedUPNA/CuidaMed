import "dotenv/config";
import Fastify from "fastify";
import { handlers } from "./handlers";
import openapiGlue from "fastify-openapi-glue";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authMiddleware } from "./middleware/auth";
import fastifyCron from "fastify-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({ logger: true });

fastify.addHook("preHandler", async (request, reply) => {
  const publicPaths = ["/login", "/register", "/health", "/documentation"];

  if (!publicPaths.includes(request.url)) {
    await authMiddleware(request, reply);
  }
});

const options = {
  specification: path.resolve(__dirname, "../../api/openapi/bundled.yaml"),
  serviceHandlers: handlers,
};
fastify.register(openapiGlue, options);
fastify.register(fastifyCors, { origin: "*" });
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../../docs"),
});
fastify.register(fastifyCron, {
  jobs: [
    {
      cronTime: "0 * * * * *",
      onTick: async () => {
        fastify.log.info("Mandando notificaciones...");
      },
    },
  ],
});

fastify.get("/documentation", async (request, reply) => {
  return reply.type("text/html").sendFile("/api.html");
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.cron.startAllJobs();
});

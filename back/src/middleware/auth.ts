import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (process.env.DISABLE_AUTH === "true") {
    return;
  }

  try {
    console.log("🔹 AUTH MIDDLEWARE EJECUTADO");
    console.log("🔹 HEADERS RECIBIDOS:", request.headers);
    const authHeader = request.headers.authorization;
    console.log("🔹 AUTH HEADER:", authHeader);

    if (!authHeader) {
      console.log("Missing authorization header");
      return reply.status(401).send({ error: "Missing authorization header" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      console.log("Missing token");
      return reply.status(401).send({ error: "Missing token" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is not defined");
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    console.log("🔸 TOKEN DECODIFICADO:", decoded);
    console.log("🔸 USER ASIGNADO A REQUEST:", request.user);

    Object.assign(request, { user: decoded });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({ error: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return reply.status(401).send({ error: "Token expired" });
    }
    request.log.error(error);
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

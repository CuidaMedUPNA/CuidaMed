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
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ error: "Missing authorization header" });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return reply.status(401).send({ error: "Missing token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "your_super_secret_key_that_is_at_least_32_characters_long_for_secure_jwt_signing_purposes_12345"
    ) as JWTPayload;

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

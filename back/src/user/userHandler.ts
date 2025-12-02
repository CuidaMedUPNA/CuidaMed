import { RouteHandlers } from "@cuidamed-api/server";
import {
  validateCredentials,
  createUser,
  saveDeviceToken,
  getUserById,
} from "./userRepository";
import { NewUser } from "../db/types";
import jwt from "jsonwebtoken";

export type Gender = "male" | "female";

export const userHandlers: Partial<RouteHandlers> = {
  login: async (request, reply) => {
    try {
      const { email, password, firebaseToken, platform, deviceId } =
        request.body;

      const user = await validateCredentials(email, password);

      if (!user) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      // Por ahora guardamos siempre el token del dispositivo
      await saveDeviceToken(
        user.id,
        firebaseToken,
        platform as "android" | "ios" | "web",
        deviceId
      );

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return reply.status(200).send({ token });
    } catch (error) {
      request.log.error(error);

      if (
        error instanceof Error &&
        error.message === "JWT_SECRET is not defined"
      ) {
        return reply.status(500).send({ error: "Internal Server Error" });
      }

      return reply.status(400).send({ error: "Bad Request" });
    }
  },

  registerUser: async (request, reply) => {
    try {
      const userData = request.body;

      const newUser: NewUser = {
        name: userData.username,
        email: userData.email,
        password: userData.password,
        birthdate: userData.birthdate || null,
        profile_picture: userData.profilePictureUrl || null,
        gender: userData.gender || null,
      };

      const createdUser = await createUser(newUser);
      return reply.status(201).send(createdUser);
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ error: "Bad Request" });
    }
  },

  getProfile: async (request, reply) => {
    try {
      const userId = request.user?.userId;

      if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const user = await getUserById(userId);
      if (!user) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
      const mappedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        birthdate: user.birthdate || undefined,
        gender: (user.gender as Gender) || undefined,
        profilePictureUrl: user.profile_picture || undefined,
      };
      return reply.status(200).send(mappedUser);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },
};

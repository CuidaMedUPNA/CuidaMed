import { RouteHandlers } from "@cuidamed-api/server";
import { validateCredentials, createUser } from "./userRepository";
import { NewUser } from "../db/types";
import jwt from "jsonwebtoken";

export const userHandlers: Partial<RouteHandlers> = {
  login: async (request, reply) => {
    try {
      const { email, password } = request.body;

      const user = await validateCredentials(email, password);

      if (!user) {
        return reply.status(401).send({ error: "Invalid email or password" });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return reply.status(200).send({ token });
    } catch (error) {
      request.log.error(error);
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
    return reply.status(200).send();
  },
};

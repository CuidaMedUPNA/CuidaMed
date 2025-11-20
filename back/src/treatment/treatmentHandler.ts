import { RouteHandlers } from "@cuidamed-api/server";
import { NewTreatment, TreatmentUpdate } from "../db/types";
import {
  insertTreatment,
  getTreatmentsByUserId,
  getTreatmentById,
  deleteTreatmentByTreatmentId,
  updateTreatmentById,
} from "./treatmentRepository";
import { getUserById } from "../user/userRepository";

export const treatmentHandlers: Partial<RouteHandlers> = {
  createTreatment: async (request, reply) => {
    try {
      const treatment = request.body;

      const newTreatment: NewTreatment = {
        name: treatment.name,
        user_id: Number(treatment.userId),
        start_date: treatment.startDate,
        end_date: treatment.endDate,
      };

      const insertedTreatment = await insertTreatment(newTreatment);
      return reply.status(200).send(insertedTreatment);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  getTreatments: async (request, reply) => {
    try {
      const userId = request.query.userId;
      const user = await getUserById(Number(userId));
      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }
      const treatments = await getTreatmentsByUserId(Number(userId));
      return reply.status(200).send(treatments);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  getTreatmentById: async (request, reply) => {
    try {
      const treatmentId = request.params.treatmentId;
      const treatment = await getTreatmentById(treatmentId);

      if (!treatment) {
        return reply.status(404).send({ error: "Treatment not found" });
      }

      return reply.status(200).send(treatment);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  deleteTreatment: async (request, reply) => {
    try {
      const treatmentId = Number(request.params.treatmentId);
      const rowsDeleted = await deleteTreatmentByTreatmentId(treatmentId);
      if (rowsDeleted === 0) {
        return reply.status(404).send({ error: "Treatment not found" });
      }
      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  updateTreatment: async (request, reply) => {
    try {
      const treatmentId = Number(request.params.treatmentId);
      const treatmentData = request.body;

      const newData: TreatmentUpdate = {
        name: treatmentData.name,
        start_date: treatmentData.startDate,
        end_date: treatmentData.endDate ?? null,
      };

      const updatedTreatment = await updateTreatmentById(treatmentId, newData);

      if (updatedTreatment === 0n) {
        return reply.status(404).send({ error: "Treatment not found" });
      }

      const responseTreatment = {
        id: treatmentId,
        name: treatmentData.name,
        userId: treatmentData.userId,
        startDate: treatmentData.startDate,
        endDate: treatmentData.endDate ?? undefined,
      };

      return reply.status(200).send(responseTreatment);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },
};

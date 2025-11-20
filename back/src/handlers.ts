import { RouteHandlers } from "@cuidamed-api/server";
import { NewTreatment, TreatmentUpdate, NewUser } from "./db/types";
import { db } from "./db/database";
import jwt from "jsonwebtoken";
import {
  insertTreatment,
  getTreatmentsByUserId,
  getTreatmentById,
  updateTreatmentById,
  deleteTreatmentByTreatmentId,
} from "./treatment/treatmentRepository";
import { getAllMedicines } from "./medicine/medicineRepository";
import {
  insertIntakeToTreatment,
  deleteIntakeFromTreatment,
  getIntakesByTreatmentId,
} from "./intake/intakeRepository";
import { createUser } from "./user/userRepository";
import { validateCredentials } from "./user/userRepository";

export const handlers: RouteHandlers = {
  healthCheck: async (request, reply) => {
    await reply.status(200).send({ status: "ok" });
  },

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

      await reply.status(200).send({ token });
    } catch (error) {
      request.log.error(error);
      reply.status(400).send({ error: "Bad Request" });
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
      await reply.status(201).send(createdUser);
    } catch (error) {
      request.log.error(error);
      reply.status(400).send({ error: "Bad Request" });
    }
  },

  getProfile: async (request, reply) => {
    reply.status(200).send();
  },

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
      await reply.status(200).send(insertedTreatment);
    } catch (err) {
      console.error("Error in createTreatment:", err);
      await reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  getTreatments: async (request, reply) => {
    const userId = request.query.userId;

    const treatments = await getTreatmentsByUserId(userId);

    await reply.status(200).send(treatments);
  },

  getTreatmentById: async (request, reply) => {
    const treatmentId = request.params.treatmentId;
    const treatment = await getTreatmentById(treatmentId);

    if (!treatment) {
      return reply.status(404).send({ error: "Treatment not found" });
    }

    reply.status(200).send(treatment);
  },

  createIntake: async (request, reply) => {
    try {
      const dosingSchedule = request.body;
      const insertedSchedule = await insertIntakeToTreatment(dosingSchedule);

      const insertedTimes = await db
        .selectFrom("dosing_time")
        .selectAll()
        .where("dosing_schedule_id", "=", insertedSchedule.id)
        .execute();

      const medicine = await db
        .selectFrom("medicine")
        .select("trade_name")
        .where("id", "=", insertedSchedule.medicine_id)
        .executeTakeFirstOrThrow();

      const response = {
        id: insertedSchedule.id,
        medicineId: insertedSchedule.medicine_id,
        medicineName: medicine.trade_name,
        treatmentId: insertedSchedule.treatment_id,
        startDate: new Date(insertedSchedule.start_date)
          .toISOString()
          .split("T")[0],
        endDate: insertedSchedule.end_date
          ? new Date(insertedSchedule.end_date).toISOString().split("T")[0]
          : undefined,
        doseAmount: insertedSchedule.dose_amount,
        doseUnit: insertedSchedule.dose_unit,
        dosingTimes: insertedTimes.map((time) => {
          const [hours, minutes] = time.scheduled_time.split(":");
          return {
            id: time.id,
            dosingScheduleId: time.dosing_schedule_id,
            scheduledTime: `${hours}:${minutes}`,
            dayOfWeek: time.day_of_week,
          };
        }),
      };

      await reply.status(201).send(response);
    } catch (err) {
      console.error("Error in createIntake:", err);
      await reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  deleteTreatment: async (request, reply) => {
    try {
      const treatmentId = Number(request.params.treatmentId);
      const rowsDeleted = await deleteTreatmentByTreatmentId(treatmentId);
      if (rowsDeleted === 0) {
        reply.status(404).send({ error: "Treatment not found" });
      }
      reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  getIntakesByTreatment: async (request, reply) => {
    try {
      const treatmentId = Number(request.params.treatmentId);
      const intakes = await getIntakesByTreatmentId(treatmentId);
      reply.status(200).send(intakes);
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  deleteIntake: async (request, reply) => {
    try {
      const rowsDeleted = await deleteIntakeFromTreatment(
        request.params.treatmentId,
        request.params.intakeId
      );

      if (rowsDeleted === 0) {
        return reply.status(404).send({ error: "Intake not found" });
      }
      reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
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

      await reply.status(200).send(responseTreatment);
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  },

  getAllMedicines: async (request, reply) => {
    try {
      const medicines = await getAllMedicines();
      return reply.status(200).send(medicines);
    } catch (err) {
      console.error("Error in getAllMedicines:", err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },
};

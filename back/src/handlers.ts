import { RouteHandlers } from "@cuidamed-api/server";
import { NewTreatment } from "./db/types";
import { db } from "./db/database";
import {
    insertTreatment,
    getTreatmentsByUserId,
    insertIntakeToTreatment,
    deleteIntakeFromTreatment,
    getIntakesByTreatmentId,
    getTreatmentById,
} from "./repository/treatmentRepository";

export const handlers: RouteHandlers = {
    healthCheck: async (request, reply) => {
        await reply.status(200).send({ status: "ok" });
    },

    createTreatment: async (request, reply) => {
        const treatment = request.body;

        const newTreatment: NewTreatment = {
            name: treatment.name,
            user_id: Number(treatment.userId),
            start_date: treatment.startDate,
            end_date: treatment.endDate,
        };

        const insertedTreatment = await insertTreatment(newTreatment);
        await reply.status(200).send(insertedTreatment);
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
            startDate: insertedSchedule.start_date.toISOString().split("T")[0],
            endDate: insertedSchedule.end_date?.toISOString().split("T")[0],
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
    },
    getIntakesByTreatment: async (request, reply) => {
        const treatmentId = request.params.treatmentId;
        const intakes = await getIntakesByTreatmentId(treatmentId);
        reply.status(200).send(intakes);
    },
    deleteIntake: async (request, reply) => {
        const rowsDeleted = await deleteIntakeFromTreatment(
            request.params.treatmentId,
            request.params.intakeId
        );

        if (rowsDeleted === 0) {
            return reply.status(404).send({ error: "Intake not found" });
        }
        reply.status(204).send();
    },
    deleteTreatment: async (request, reply) => {
        Number(request.params.treatmentId);
        reply.status(204).send();
    },
    updateTreatment: async (request, reply) => {
        Number(request.params.treatmentId);
        reply.status(200).send();
    },
    getAllMedicines: async (request, reply) => {
        reply.status(200).send([]);
    },
};

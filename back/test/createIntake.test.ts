import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { app, db } from "./setup";
import * as treatmentRepo from "../src/repository/treatmentRepository";
import * as mockInsert from "./utils/seedTestDB";

describe("POST /treatments/{treatmentId}/intakes", () => {

    let medicineId: number;
    let treatmentId: number;

    beforeAll(async () => {
        const user = await mockInsert.insertUser();

        medicineId = (await mockInsert.insertMedicine()).id;

        treatmentId = (await mockInsert.insertTreatment({ user_id: user.id })).id;
    });

    it("returns 201 for a succesfully intake insertion into a treatment", async () => {

        const defaultMedicineId = medicineId;
        const defaultTreatmentId = treatmentId;

        const newDosingSchedule = {
            medicineId: defaultMedicineId,           
            treatmentId: defaultTreatmentId,
            startDate: "2025-11-12",   
            endDate: "2025-12-12",     
            doseAmount: 500,           
            doseUnit: "mg",   
            dosingTimes: [
                {
                scheduledTime: "08:00",
                dayOfWeek: null    
                },
                {
                scheduledTime: "20:00",
                dayOfWeek: null
                }
            ]
        };

        const res = await app.inject({
            method: "POST",
            url: `/treatments/${defaultTreatmentId}/intakes`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newDosingSchedule),
        });

        expect(res.statusCode).toBe(201);
    });

    it("returns 400 when treatmentId is invalid", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/treatments/abc/intakes",
        });

        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Bad Request");
    });

    it("returns 500 when there is an internal server error", async () => {
        const spy = vi
            .spyOn(treatmentRepo, "getIntakesByTreatmentId")
            .mockRejectedValueOnce(new Error("DB connection failed"));

            const res = await app.inject({
            method: "GET",
            url: "/treatments/999/intakes", 
        });

        spy.mockRestore();

        expect(res.statusCode).toBe(500);
        const body = res.json();
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Internal Server Error");
    });

    afterAll(async () => {
        await db.deleteFrom("dosing_time").execute();
        await db.deleteFrom("dosing_schedule").execute();
        await db.deleteFrom("treatment").execute();
        await db.deleteFrom("medicine").execute();
        await db.deleteFrom("user").execute();
    });

});


import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, db } from "./setup";
import * as mockInsert from "./utils/seeders";

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

    afterAll(async () => {
        await db.deleteFrom("dosing_time").execute();
        await db.deleteFrom("dosing_schedule").execute();
        await db.deleteFrom("treatment").execute();
        await db.deleteFrom("medicine").execute();
        await db.deleteFrom("user").execute();
    });

});


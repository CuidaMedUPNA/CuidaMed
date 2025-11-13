import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, db } from "./setup";
import * as mockInsert from "./utils/seeders";

describe("POST /treatments/", () => {

    let defaultUserId: number;

    beforeAll(async () => {
        const user = await mockInsert.insertUser();
        defaultUserId = user.id;
    });

    it("returns 201 for a succesfully treatment creation", async () => {

        const newTreatment = {
            name: "Tratamiento antibiótico",
            userId: defaultUserId,
            startDate: "2024-01-01",
            endDate: "2024-02-01",
        };

        const res = await app.inject({
            method: "POST",
            url: `/treatments`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTreatment),
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


import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "./setup";
import { clearTestDB, insertTreatment, insertUser } from "./utils/seedTestDB";

describe("GET /treatments/{userId}", () => {

    let defaultUserId: number;

    beforeAll(async () => {
        const user = await insertUser();
        defaultUserId = user.id;

        await insertTreatment({ 
            user_id: defaultUserId,
            name: "Treatment A",
            end_date: "2026-12-31"
        });
        await insertTreatment({ 
            user_id: defaultUserId,
            name: "Treatment B",
            end_date: "2026-12-31"
        });

    });

    it("retrieve all treatments for an user id", async () => {
        const response = await app.inject({
            method: "GET",
            url: `/treatments?userId=${defaultUserId}`,
        });

        expect(response.statusCode).toBe(200);
        const treatments = response.json();
        expect(treatments).toHaveLength(2);
        expect(treatments[0]).toHaveProperty("name", "Treatment A");
        expect(treatments[1]).toHaveProperty("name", "Treatment B");
    });

    it("returns 400 if user id is not a number", async () => {
        const response = await app.inject({
            method: "GET",
            url: `/treatments?userId=abc`,
        });

        expect(response.statusCode).toBe(400);
    });

    it("returns 404 if user does not exist", async () => {
        const response = await app.inject({
            method: "GET",
            url: `/treatments?userId=9999`,
        });

        expect(response.statusCode).toBe(404);
    });

    afterAll(async () => {
        await clearTestDB();
    });
});
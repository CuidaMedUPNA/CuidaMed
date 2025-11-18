import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "./setup";
import { clearTestDB, insertTreatment, insertUser } from "./utils/seedTestDB";

describe("GET /treatments?userId={userId}", () => {

    beforeAll(async () => {
        await insertUser();

        await insertTreatment();
        await insertTreatment();

    });

    it("retrieve all treatments for a user id", async () => {
        const response = await app.inject({
            method: "GET",
            url: `/treatments?userId=1`,
        });

        expect(response.statusCode).toBe(200);
        const treatments = response.json();
        expect(treatments).toHaveLength(2);
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
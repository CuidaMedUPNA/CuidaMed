import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "./setup";
import { clearTestDB, insertUser } from "./utils/seedTestDB";

describe("POST /treatments/", () => {

    let defaultUserId: number;

    beforeAll(async () => {
        const user = await insertUser();
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

        expect(res.statusCode).toBe(200);
    });

    afterAll(async () => {
        await clearTestDB();
    });

});


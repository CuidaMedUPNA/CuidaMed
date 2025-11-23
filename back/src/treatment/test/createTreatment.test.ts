import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../../test/setup";
import {
  clearTestDB,
  insertUser,
  generateTestToken,
} from "../../../test/utils/seedTestDB";

describe("POST /treatments/", () => {
  let testUserId: number;
  let testToken: string;

  beforeAll(async () => {
    const user = await insertUser();
    testUserId = user.id;
    testToken = generateTestToken(testUserId, "user@example.com");

    process.env.DISABLE_AUTH = "false";
  });

  it("returns 200 for a succesfully treatment creation", async () => {
    const newTreatment = {
      name: "Tratamiento antibiótico",
      startDate: "2024-01-01",
      endDate: "2024-02-01",
    };

    const res = await app.inject({
      method: "POST",
      url: `/treatments`,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${testToken}`,
      },
      body: JSON.stringify(newTreatment),
    });

    expect(res.statusCode).toBe(200);
    const data = res.json();
    expect(data.name).toBe(newTreatment.name);
    expect(data.startDate).toBe(newTreatment.startDate);
    expect(data.endDate).toBe(newTreatment.endDate);
  });

  it("returns 400 for a treatment creation with missing fields", async () => {
    const incompleteTreatment = {
      name: "Tratamiento incompleto",
    };

    const res = await app.inject({
      method: "POST",
      url: `/treatments`,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${testToken}`,
      },
      body: JSON.stringify(incompleteTreatment),
    });

    expect(res.statusCode).toBe(400);
  });

  afterAll(async () => {
    await clearTestDB();
  });
});

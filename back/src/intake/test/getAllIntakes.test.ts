import { describe, it, beforeAll, afterAll, expect } from "vitest";
import * as mockInsert from "../../../test/utils/seedTestDB";
import { app } from "../../../test/setup";

describe("GET /intakes", () => {
  let testUserId: number;
  let testToken: string;

  beforeAll(async () => {
    const user = await mockInsert.insertUser();
    testUserId = user.id;
    testToken = mockInsert.generateTestToken(testUserId, "user@example.com");

    process.env.DISABLE_AUTH = "false";

    await mockInsert.insertUser();
    await mockInsert.insertMedicine();
    await mockInsert.insertTreatment();
    await mockInsert.insertDosingSchedule();
    await mockInsert.insertDosingTime();
  });

  it("returns 200 and all intakes", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/intakes",
      headers: {
        authorization: `Bearer ${testToken}`,
      },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(1);
  });

  it("returns 401 for missing or invalid token", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/intakes",
    });

    expect(res.statusCode).toBe(401);
    const body = res.json();
    expect(body).toHaveProperty("error");
  });

  afterAll(async () => {
    await mockInsert.clearTestDB();
  });
});

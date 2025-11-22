import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../../test/setup";
import {
  clearTestDB,
  insertUser,
  insertTreatment,
  generateTestToken,
} from "../../../test/utils/seedTestDB";

describe("GET /treatments", () => {
  let testUserId: number;
  let testToken: string;

  beforeAll(async () => {
    const user = await insertUser();
    testUserId = user.id;
    testToken = generateTestToken(testUserId, "user@example.com");

    process.env.DISABLE_AUTH = "false";

    await insertTreatment({
      user_id: testUserId,
    });

    await insertTreatment({
      user_id: testUserId,
    });
  });

  it("returns the list of active treatments for authenticated user", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments`,
      headers: {
        authorization: `Bearer ${testToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const data = res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  it("returns 401 if no auth token is provided", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments`,
    });

    expect(res.statusCode).toBe(401);
  });

  afterAll(async () => {
    await clearTestDB();
  });
});

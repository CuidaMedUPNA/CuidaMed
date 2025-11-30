import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../../test/setup";
import {
  insertUser,
  clearTestDB,
  generateTestToken,
} from "../../../test/utils/seedTestDB";

describe("GET /me", () => {
  let testUserId: number;
  let testToken: string;

  beforeAll(async () => {
    const user = await insertUser();
    testUserId = user.id;
    testToken = generateTestToken(testUserId, "user@example.com");

    process.env.DISABLE_AUTH = "false";
  });

  it("returns 200 for a successful user data retrieval", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: `Bearer ${testToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("id", testUserId);
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("email");
  });

  it("returns 401 for missing or invalid token", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/me",
    });

    expect(res.statusCode).toBe(401);
    const body = res.json();
    expect(body).toHaveProperty("error");
  });

  afterAll(async () => {
    await clearTestDB();
  });
});

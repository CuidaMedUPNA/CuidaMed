import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../../test/setup";
import {
  clearTestDB,
  insertUser,
  insertTreatment,
} from "../../../test/utils/seedTestDB";

describe("GET /treatments?userId={userId}", () => {
  let testUserId: number;

  beforeAll(async () => {
    const user = await insertUser();
    testUserId = user.id;

    await insertTreatment({
      user_id: testUserId,
    });

    await insertTreatment({
      user_id: testUserId,
    });
  });

  it("returns the list of active treatments for a userId", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments?userId=${testUserId}`,
    });
    expect(res.statusCode).toBe(200);
    const data = res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  it("returns 400 if userId is not provided", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments`,
    });

    expect(res.statusCode).toBe(400);
  });

  it("returns 400 if userId is invalid", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments?userId=abc`,
    });

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 if user does not exist", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments?userId=9999`,
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().error).toBe("User not found");
  });

  afterAll(async () => {
    await clearTestDB();
  });
});

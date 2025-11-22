import { describe, beforeAll, expect, it } from "vitest";
import * as mockInsert from "../../../test/utils/seedTestDB";
import { app } from "../../../test/setup";

describe("GET /me", () => {
  let userId: number;
  let token: string;

  beforeAll(async () => {
    const user = await mockInsert.insertUser();
    userId = user.id;
  });

  it("should retrieve the profile of the authenticated user", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: "Whatever",
      },
    });

    expect(res.statusCode).toBe(200);

    const profile = res.json();
    expect(profile).toHaveProperty("id", userId);
    expect(profile).toHaveProperty("name");
    expect(profile).toHaveProperty("email");
  });

  it("should return 401 without authorization header", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/me",
    });

    expect(res.statusCode).toBe(401);
    const profile = res.json();
    expect(profile).toHaveProperty("error", "Unauthorized");
  });

  it("should return 401 with invalid token", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: "Bearer invalid-token",
      },
    });

    expect(res.statusCode).toBe(401);
    const profile = res.json();
    expect(profile).toHaveProperty("error", "Unauthorized");
  });
});

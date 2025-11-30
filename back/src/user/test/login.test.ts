import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../../../test/setup";
import * as mockInsert from "../../../test/utils/seedTestDB";

describe("POST /login", () => {
  beforeAll(async () => {
    await mockInsert.insertUser();
  });

  it("returns 200 for a successful login", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/login",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "user@example.com",
        password: "secret",
        firebaseToken: "someFirebaseToken",
        platform: "android",
        deviceId: "emulator-5554",
      }),
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty("token");
  });

  it("returns 401 for invalid credentials", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/login",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "user@example.com",
        password: "wrongpassword",
        firebaseToken: "someFirebaseToken",
        platform: "android",
        deviceId: "emulator-5554",
      }),
    });

    expect(res.statusCode).toBe(401);
    const body = res.json();
    expect(body).toHaveProperty("error");
  });
});

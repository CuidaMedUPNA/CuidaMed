import { describe, it, expect } from "vitest";
import { app } from "../../../test/setup";

describe("POST /register", () => {
  it("returns 201 for a successful registration", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/register",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New User",
        email: "newuser@example.com",
        password: "newpassword",
        firebaseToken: "someFirebaseToken",
        platform: "ios",
        deviceId: "device-1234",
      }),
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("email", "newuser@example.com");
  });

  it("returns 400 for missing fields", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/register",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "",
        password: "newpassword",
        firebaseToken: "someFirebaseToken",
        platform: "ios",
        deviceId: "device-1234",
      }),
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body).toHaveProperty("error");
  });
});

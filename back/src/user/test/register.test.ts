import { describe, it, expect, afterAll } from "vitest";
import { app } from "../../../test/setup";
import { clearTestDB } from "../../../test/utils/seedTestDB";

describe("POST /register", () => {
  afterAll(async () => {
    await clearTestDB();
  });

  it("returns 201 for a successful registration", async () => {
    const newUser = {
      username: "New User",
      email: "newuser2@example.com",
      password: "newpassword",
      firebaseToken: "someFirebaseToken",
      platform: "android",
      deviceId: "emulator-5554",
    };

    const res = await app.inject({
      method: "POST",
      url: "/register",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (res.statusCode !== 201) {
      console.log(res.body);
    }

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("email", "newuser2@example.com");
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
        platform: "android",
        deviceId: "emulator-5554",
      }),
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body).toHaveProperty("error");
  });

  afterAll(async () => {
    await clearTestDB();
  });
});

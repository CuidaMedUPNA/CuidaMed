import { describe, beforeAll, expect, it } from "vitest";
import * as mockInsert from "../../../test/utils/seedTestDB";
import { app } from "../../../test/setup";
import jwt from "jsonwebtoken";

describe("GET /me", () => {
  let userId: number;
  let token: string;
  process.env.JWT_SECRET = "testsecret";

  beforeAll(async () => {
    const user = await mockInsert.insertUser();
    userId = user.id;

    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );
  });

  it("should retrieve the profile of the authenticated user", async () => {
    console.log("🔵 TOKEN GENERADO:", token);

    const res = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🟠 STATUS:", res.statusCode);
    console.log("🟣 RESPONSE BODY:", res.json());
    console.log("🟡 REQUEST HEADERS ENVIADOS:", {
      authorization: `Bearer ${token}`,
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

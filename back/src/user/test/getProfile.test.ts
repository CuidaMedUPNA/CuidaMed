import { describe, beforeAll, expect, it } from "vitest";
import * as mockInsert from "../../../test/utils/seedTestDB";
import { app } from "../../../test/setup";

describe("GET /me/{userId}", () => {
  let userId: number;

  beforeAll(async () => {
    const user = await mockInsert.insertUser();
    userId = user.id;
  });

  it("should retrieve the profile of the user", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/me/${userId}`,
    });

    expect(res.statusCode).toBe(200);

    const profile = res.json();
    expect(profile).toHaveProperty("id", userId);
    expect(profile).toHaveProperty("name");
    expect(profile).toHaveProperty("email");
  });

  it("should return 404 if user does not exist", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/me/999999`,
    });

    expect(res.statusCode).toBe(404);
    const errorResponse = res.json();
    expect(errorResponse).toHaveProperty("error", "User not found");
  });
});

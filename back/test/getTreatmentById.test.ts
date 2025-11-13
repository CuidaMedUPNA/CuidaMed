import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, db } from "./setup";
import * as mockInsert from "./utils/seedTestDB";

describe("GET /treatments/{treatmentId}", () => {
  let treatmentId: number;
  beforeAll(async () => {
    const user = await mockInsert.insertUser();

    const treatment = await mockInsert.insertTreatment();

    treatmentId = treatment.id;
  });

  it("retrieves the treatment with the given ID", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments/${treatmentId}`,
    });

    expect(res.statusCode).toBe(200);

    const treatment = res.json();
    expect(treatment).toHaveProperty("id", treatmentId);
    expect(treatment).toHaveProperty("name");
    expect(treatment).toHaveProperty("userId");
    expect(treatment).toHaveProperty("startDate");
  });

  it("returns 400 for an invalid treatment ID", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments/invalid-id`,
    });

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 for a non-existing treatment ID", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/treatments/9999`,
    });

    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await db.deleteFrom("treatment").where("id", "=", treatmentId).execute();
    await db.deleteFrom("user").where("id", "=", 1).execute();
  });
});

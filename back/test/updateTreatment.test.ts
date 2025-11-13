import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "./setup";
import { insertUser, insertTreatment, clearTestDB } from "./utils/seedTestDB";

describe("PUT /treatments/", () => {
  let defaultUserId: number;
  let treatmentId: number;

  beforeAll(async () => {
    const user = await insertUser();
    defaultUserId = user.id;

    const treatment = await insertTreatment({
      name: "Tratamiento inicial",
      user_id: defaultUserId,
      start_date: "2025-01-01",
      end_date: "2026-01-01",
    });

    treatmentId = treatment.id;
  });

  it("returns infor from the successful treatment update", async () => {
    const updatedTreatment = {
      name: "Tratamiento actualizado",
      userId: defaultUserId,
      startDate: "2025-02-01",
      endDate: "2027-02-01",
    };

    const res = await app.inject({
      method: "PUT",
      url: `/treatments/${treatmentId}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTreatment),
    });

    expect(res.statusCode).toBe(200);
    const data = res.json();
    expect(data.name).toBe(updatedTreatment.name);
    expect(data.userId).toBe(updatedTreatment.userId);
    expect(data.startDate).toBe(updatedTreatment.startDate);
    expect(data.endDate).toBe(updatedTreatment.endDate);
  });

  it("returns 400 for a treatment update with invalid data", async () => {
    const invalidTreatment = {
      name: "",
      userId: defaultUserId,
      startDate: "invalid-date",
      endDate: "2027-02-01",
    };

    const res = await app.inject({
      method: "PUT",
      url: `/treatments/${treatmentId}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidTreatment),
    });

    expect(res.statusCode).toBe(400);
  });

  it("returns 404 for updating a non-existent treatment", async () => {
    const invalidTreatmentId = 9999;

    const updatedTreatment = {
      name: "Tratamiento inexistente",
      userId: defaultUserId,
      startDate: "2025-02-01",
      endDate: "2027-02-01",
    };

    const res = await app.inject({
      method: "PUT",
      url: `/treatments/${invalidTreatmentId}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTreatment),
    });

    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await clearTestDB();
  });
});

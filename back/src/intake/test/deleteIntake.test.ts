import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app } from "../../../test/setup";
import {
  insertDosingSchedule,
  insertMedicine,
  insertUser,
  insertTreatment,
  clearTestDB,
} from "../../../test/utils/seedTestDB";
import { getIntakesByTreatmentId } from "../intakeRepository";

describe("DELETE /treatments/{treatmentId}/intakes/{intakeId}", () => {
  let treatmentId: number;
  let intakeId: number;

  beforeAll(async () => {
    await insertUser();

    const treatment = await insertTreatment();

    await insertMedicine();

    const intake = await insertDosingSchedule();

    treatmentId = treatment.id;
    intakeId = intake.id;
  });

  it("deletes the intake with the given ID from the treatment", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/treatments/${treatmentId}/intakes/${intakeId}`,
    });

    expect(res.statusCode).toBe(204);

    const deletedIntakes = await getIntakesByTreatmentId(treatmentId);
    expect(deletedIntakes).toEqual([]);
  });

  it("returns 404 if the treatment does not exist", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/treatments/9999/intakes/${intakeId}`,
    });

    expect(res.statusCode).toBe(404);

    const responseBody = JSON.parse(res.body);
    expect(responseBody).toHaveProperty("error", "Intake not found");
  });

  it("returns 404 if the intake does not exist", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/treatments/${treatmentId}/intakes/9999`,
    });

    expect(res.statusCode).toBe(404);

    const responseBody = JSON.parse(res.body);
    expect(responseBody).toHaveProperty("error", "Intake not found");
  });

  afterAll(async () => {
    await clearTestDB();
  });
});

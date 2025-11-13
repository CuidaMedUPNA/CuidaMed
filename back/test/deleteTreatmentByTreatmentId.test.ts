import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { app, db } from "./setup";
import * as treatmentRepo from "../src/repository/treatmentRepository";
import * as mockInsert from "./utils/seedTestDB";

describe("DELETE /treatments/{treatmentId}", () => {
  beforeAll(async () => {
    const user = await mockInsert.insertUser();

    const medicine = await mockInsert.insertMedicine();

    const medicine2 = await mockInsert.insertMedicine();

    const treatment = await mockInsert.insertTreatment({ user_id: user.id });

    const schedule = await mockInsert.insertDosingSchedule({
      medicine_id: medicine.id,
      treatment_id: treatment.id,
    });

    const schedule2 = await mockInsert.insertDosingSchedule({
      medicine_id: medicine2.id,
      treatment_id: treatment.id,
      dose_amount: 2,
      dose_unit: "ml",
    });

    await mockInsert.insertDosingTime({
      dosing_schedule_id: schedule.id,
      scheduled_time: "08:00",
      day_of_week: 1,
    });

    await mockInsert.insertDosingTime({
      dosing_schedule_id: schedule.id,
      scheduled_time: "20:00",
      day_of_week: 1,
    });

    await mockInsert.insertDosingTime({
      dosing_schedule_id: schedule2.id,
      scheduled_time: "09:00",
      day_of_week: 1,
    });

    await mockInsert.insertDosingTime({
      dosing_schedule_id: schedule2.id,
      scheduled_time: "21:00",
      day_of_week: 1,
    });
  });

  it("deletes the treatment with the given ID", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/treatments/1",
    });

    expect(res.statusCode).toBe(204);

    const treatment = await treatmentRepo.getTreatmentById(1);
    expect(treatment).toBeNull();
  });

  it("returns 404 if the treatment does not exist", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/treatments/999",
    });

    expect(res.statusCode).toBe(404);
    const responseBody = JSON.parse(res.body);
    expect(responseBody).toHaveProperty("error", "Treatment not found");
  });

  afterAll(async () => {
    await db.deleteFrom("dosing_time").execute();
    await db.deleteFrom("dosing_schedule").execute();
    await db.deleteFrom("treatment").execute();
    await db.deleteFrom("medicine").execute();
    await db.deleteFrom("user").execute();
  });
});

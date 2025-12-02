import { describe, it, beforeAll, expect } from "vitest";
import { app } from "../../../test/setup";
import * as mockInsert from "../../../test/utils/seedTestDB";

describe("GET /todayIntakes", () => {
  let testUserId: number;
  let testToken: string;

  beforeAll(async () => {
    type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;
    const dayOfWeek: DayOfWeek =
      new Date().getDay() === 0 ? 7 : (new Date().getDay() as DayOfWeek);

    const user = await mockInsert.insertUser();

    await mockInsert.insertMedicine();

    await mockInsert.insertTreatment();

    const schedule = await mockInsert.insertDosingSchedule();

    await mockInsert.insertDosingTime({
      dosing_schedule_id: schedule.id,
      scheduled_time: "08:00",
      day_of_week: dayOfWeek,
    });

    testUserId = user.id;
    testToken = mockInsert.generateTestToken(testUserId, "user@example.com");

    process.env.DISABLE_AUTH = "false";
  });

  it("returns today's intakes for the user", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/todayIntakes",
      headers: {
        Authorization: `Bearer ${testToken}`,
      },
    });

    expect(res.statusCode).toBe(200);
    const intakes = JSON.parse(res.body);
    expect(Array.isArray(intakes)).toBe(true);
    expect(intakes.length).toBeGreaterThan(0);
  });

  it("returns 401 if no auth token is provided", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/intakes/today",
    });

    expect(res.statusCode).toBe(401);
  });
});

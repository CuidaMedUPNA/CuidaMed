import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { app, db } from "./setup";
import * as treatmentRepo from "../src/repository/treatmentRepository";

describe("GET /treatments/{treatmentId}/intakes", () => {

  beforeAll(async () => {
    // Crear usuario
    const [user] = await db
      .insertInto("user")
      .values({
        name: "Juan",
        email: "juan@example.com",
        password: "secret",
      })
      .returning(["id"])
      .execute();

    // Crear medicinas
    const [medicine] = await db
      .insertInto("medicine")
      .values({
        trade_name: "Paracetamol",
      })
      .returning(["id"])
      .execute();

    const [medicine2] = await db
      .insertInto("medicine")
      .values({
        trade_name: "Ibuprofeno",
      })
      .returning(["id"])
      .execute();

    // Crear tratamiento
    const [treatment] = await db
      .insertInto("treatment")
      .values({
        name: "Tratamiento fiebre",
        user_id: user.id,
        start_date: "2025-01-01",
        end_date: null,
      })
      .returning(["id"])
      .execute();

    // Crear dosing_schedules
    const [schedule] = await db
      .insertInto("dosing_schedule")
      .values({
        medicine_id: medicine.id,
        treatment_id: treatment.id,
        start_date: "2025-01-01",
        end_date: null,
        dose_amount: 1,
        dose_unit: "comprimido",
      })
      .returning(["id"])
      .execute();

    const [schedule2] = await db
      .insertInto("dosing_schedule")
      .values({
        medicine_id: medicine2.id,
        treatment_id: treatment.id,
        start_date: "2025-01-01",
        end_date: null,
        dose_amount: 2,
        dose_unit: "ml",
      })
      .returning(["id"])
      .execute();

    // Crear dosing_times
    await db
      .insertInto("dosing_time")
      .values([
        {
          dosing_schedule_id: schedule.id,
          scheduled_time: "08:00",
          day_of_week: 1,
        },
        {
          dosing_schedule_id: schedule.id,
          scheduled_time: "20:00",
          day_of_week: 1,
        },
      ])
      .execute();

    await db
      .insertInto("dosing_time")
      .values([
        {
          dosing_schedule_id: schedule2.id,
          scheduled_time: "09:00",
          day_of_week: 1,
        },
        {
          dosing_schedule_id: schedule2.id,
          scheduled_time: "21:00",
          day_of_week: 1,
        },
      ])
      .execute();
  });

  //Tests que verifican la integridad de la ruta GET /treatments/:treatmentId
  //Usan un objeto kysely y la app de fastify importados desde setup.ts
  it("Test codigo 200 para obtener las tomas de un tratamiento", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/treatments/1/intakes",
    });

    expect(res.statusCode).toBe(200);

    const data = res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);

    const schedule = data[0];
    expect(schedule).toHaveProperty("medicineId");
    expect(schedule).toHaveProperty("treatmentId");
    expect(schedule).toHaveProperty("doseAmount", 1);
    expect(schedule).toHaveProperty("doseUnit", "comprimido");
    expect(Array.isArray(schedule.dosingTimes)).toBe(true);
    expect(schedule.dosingTimes.length).toBe(2);

    const schedule2 = data[1];
    expect(schedule2).toHaveProperty("medicineId");
    expect(schedule2).toHaveProperty("treatmentId");
    expect(schedule2).toHaveProperty("doseAmount", 2);
    expect(schedule2).toHaveProperty("doseUnit", "ml");
    expect(Array.isArray(schedule2.dosingTimes)).toBe(true);
    expect(schedule.dosingTimes.length).toBe(2);
  });

  it("Test codigo 400 si el treatmentId proporcionado no es válido", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/treatments/abc",
    });

    expect(res.statusCode).toBe(400);
  });

  it("Test codigo 200 pero con array vacío si el tratamiento no tiene tomas aun", async () => {
    const [treatment] = await db
      .insertInto("treatment")
      .values({
        name: "Tratamiento vacío",
        user_id: 1,
        start_date: "2025-01-01",
        end_date: null,
      })
      .returning(["id"])
      .execute();

    const res = await app.inject({
      method: "GET",
      url: `/treatments/${treatment.id}/intakes`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  afterAll(async () => {
    // Limpiar la base de datos
    await db.deleteFrom("dosing_time").execute();
    await db.deleteFrom("dosing_schedule").execute();
    await db.deleteFrom("treatment").execute();
    await db.deleteFrom("medicine").execute();
    await db.deleteFrom("user").execute();
  });
});

describe("GET /treatments/{treatmentId}/intakes - manejo de errores", () => {
  it("Test codigo 500 si ocurre un error interno del servidor", async () => {
    const spy = vi
      .spyOn(treatmentRepo, "getIntakesByTreatmentId")
      .mockRejectedValueOnce(new Error("DB connection failed"));

    const res = await app.inject({
      method: "GET",
      url: "/treatments/999/intakes", 
    });

    spy.mockRestore();

    expect(res.statusCode).toBe(500);

    const body = res.json();
    expect(body).toHaveProperty("error");
    expect(typeof body.error).toBe("string");
    expect(body.error).toBe("Internal Server Error");
  });
});

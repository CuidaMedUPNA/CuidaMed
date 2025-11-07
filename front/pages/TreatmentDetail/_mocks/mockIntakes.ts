import { DosingSchedule } from "@cuidamed-api/client";

export const mockIntakes: DosingSchedule[] = [
  {
    id: 1,
    medicineName: "Paracetamol",
    medicineId: 1,
    treatmentId: 1,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    doseAmount: 1,
    doseUnit: "comprimido",
    dosingTimes: [
      { id: 1, dosingScheduleId: 1, scheduledTime: "08:00" }, // Diario (sin dayOfWeek)
      { id: 2, dosingScheduleId: 1, scheduledTime: "20:00" }, // Diario (sin dayOfWeek)
    ],
  },
  {
    id: 2,
    medicineName: "Amoxicilina",
    medicineId: 2,
    treatmentId: 1,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    doseAmount: 2,
    doseUnit: "ml",
    dosingTimes: [
      { id: 3, dosingScheduleId: 2, scheduledTime: "09:00", dayOfWeek: 1 }, // Lunes
      { id: 4, dosingScheduleId: 2, scheduledTime: "09:00", dayOfWeek: 2 }, // Martes
      { id: 5, dosingScheduleId: 2, scheduledTime: "09:00", dayOfWeek: 3 }, // Miércoles
      { id: 6, dosingScheduleId: 2, scheduledTime: "09:00", dayOfWeek: 4 }, // Jueves
      { id: 7, dosingScheduleId: 2, scheduledTime: "09:00", dayOfWeek: 5 }, // Viernes
    ],
  },
  {
    id: 3,
    medicineName: "Ibuprofeno",
    medicineId: 3,
    treatmentId: 1,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    doseAmount: 1,
    doseUnit: "comprimido",
    dosingTimes: [
      { id: 8, dosingScheduleId: 3, scheduledTime: "10:00", dayOfWeek: 6 }, // Sábado
      { id: 9, dosingScheduleId: 3, scheduledTime: "10:00", dayOfWeek: 7 }, // Domingo
      { id: 10, dosingScheduleId: 3, scheduledTime: "19:00", dayOfWeek: 6 }, // Sábado
      { id: 11, dosingScheduleId: 3, scheduledTime: "19:00", dayOfWeek: 7 }, // Domingo
    ],
  },
  {
    id: 4,
    medicineName: "Metformina",
    medicineId: 4,
    treatmentId: 1,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    doseAmount: 500,
    doseUnit: "mg",
    dosingTimes: [
      { id: 12, dosingScheduleId: 4, scheduledTime: "07:00" }, // Diario
      { id: 13, dosingScheduleId: 4, scheduledTime: "13:00" }, // Diario
      { id: 14, dosingScheduleId: 4, scheduledTime: "19:00" }, // Diario
    ],
  },
  {
    id: 5,
    medicineName: "Gotas para los ojos",
    medicineId: 5,
    treatmentId: 1,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    doseAmount: 10,
    doseUnit: "gotas",
    dosingTimes: [
      { id: 15, dosingScheduleId: 5, scheduledTime: "06:00", dayOfWeek: 1 }, // Lunes
      { id: 16, dosingScheduleId: 5, scheduledTime: "06:00", dayOfWeek: 3 }, // Miércoles
      { id: 17, dosingScheduleId: 5, scheduledTime: "06:00", dayOfWeek: 5 }, // Viernes
    ],
  },
  {
    id: 6,
    medicineName: "Inyección de insulina",
    medicineId: 6,
    treatmentId: 1,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    doseAmount: 1,
    doseUnit: "inyección",
    dosingTimes: [
      { id: 18, dosingScheduleId: 6, scheduledTime: "18:00", dayOfWeek: 2 }, // Martes
      { id: 19, dosingScheduleId: 6, scheduledTime: "18:00", dayOfWeek: 5 }, // Viernes
    ],
  },
];

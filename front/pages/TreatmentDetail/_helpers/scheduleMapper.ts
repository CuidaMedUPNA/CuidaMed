import { DosingTime } from "@cuidamed-api/client";

export const mapScheduleToHorarios = (schedule: DosingTime[]) => {
  const horariosPorDia: Record<number, string[]> = {};

  schedule.forEach((dosingTime) => {
    if (dosingTime.dayOfWeek === null || dosingTime.dayOfWeek === undefined) {
      const dayKey = 0;
      if (!horariosPorDia[dayKey]) {
        horariosPorDia[dayKey] = [];
      }
      horariosPorDia[dayKey].push(dosingTime.scheduledTime);
    } else {
      const dayKey = dosingTime.dayOfWeek;
      if (!horariosPorDia[dayKey]) {
        horariosPorDia[dayKey] = [];
      }
      horariosPorDia[dayKey].push(dosingTime.scheduledTime);
    }
  });

  Object.keys(horariosPorDia).forEach((day) => {
    horariosPorDia[parseInt(day)].sort();
  });

  const isDiario = !!horariosPorDia[0];

  return { horariosPorDia, isDiario };
};

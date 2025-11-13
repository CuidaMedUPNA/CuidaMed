import { DosingTime } from "@cuidamed-api/client";

export interface NewMedicine {
  id: number;
  treatmentId: number;
  startDate: string;
  endDate: string;
  doseAmount: number;
  doseUnit: string;
  dosingTimes: DosingTime[];
}

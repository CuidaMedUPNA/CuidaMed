export interface NewDosingTime {
  scheduledTime: string;
  dayOfWeek: number;
}

export interface NewMedicine {
  medicineId: number;
  treatmentId: number;
  startDate: string;
  endDate: string | null;
  doseAmount: number;
  doseUnit: string;
  dosingTimes: NewDosingTime[];
}

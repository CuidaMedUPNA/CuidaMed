import { userHandlers } from "./user/userHandler";
import { healthHandlers } from "./helth/helthHandler";
import { treatmentHandlers } from "./treatment/treatmentHandler";
import { intakeHandlers } from "./intake/intakeHandler";
import { medicineHandlers } from "./medicine/medicineHandler";

export const handlers = {
  ...healthHandlers,
  ...userHandlers,
  ...treatmentHandlers,
  ...intakeHandlers,
  ...medicineHandlers,
};

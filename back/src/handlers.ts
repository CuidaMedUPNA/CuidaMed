import { treatmentHandlers } from "./treatments/treatmentsHandler";
import { intakesHandlers } from "./intakes/intakesHandler";
import { authHandler } from "./auth/authHandler";
import { medicinesHandler } from "./medicines/medicinesHandler";
import { healthHandlers } from "./health/healthHandler";

export const handlers = {
  ...healthHandlers,
  ...authHandler,
  ...treatmentHandlers,
  ...intakesHandlers,
  ...medicinesHandler,
};

import { RouteHandlers } from "@cuidamed-api/server";
import { getAllMedicines } from "./medicineRepository";

export const medicinesHandler: Partial<RouteHandlers> = {
  getAllMedicines: async (request, reply) => {
    try {
      const medicines = await getAllMedicines();
      return reply.status(200).send(medicines);
    } catch (err) {
      console.error("Error in getAllMedicines:", err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  },
};

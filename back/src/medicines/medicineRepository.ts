import { db } from "../db/database";
import { Medicine } from "@cuidamed-api/server";

export async function getAllMedicines(): Promise<Medicine[]> {
  const medicinesRaw = await db.selectFrom("medicine").selectAll().execute();

  return medicinesRaw.map((med) => ({
    id: med.id,
    name: med.trade_name,
    pictureUrl: med.picture ?? undefined,
  }));
}

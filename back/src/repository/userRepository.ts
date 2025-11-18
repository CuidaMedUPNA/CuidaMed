import { db } from "../db/database";

export async function getUserById(userId: number) {
    const user = await db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst();

    return user;
}
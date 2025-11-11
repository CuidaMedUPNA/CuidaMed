import { db } from "../db/database";

export async function getUserByEmail(email: string) {
  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("email", "=", email)
    .executeTakeFirst();

  return user;
}

export async function validateCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  if (user.password !== password) {
    return null;
  }

  return user;
}

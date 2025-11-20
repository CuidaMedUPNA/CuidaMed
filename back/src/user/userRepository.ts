import { db } from "../db/database";
import { NewUser } from "../db/types";

export async function createUser(user: NewUser) {
  const insertedUser = await db
    .insertInto("user")
    .values({
      name: user.name,
      email: user.email,
      password: user.password,
      birthdate: user.birthdate ?? null,
      profile_picture: user.profile_picture ?? null,
      gender: user.gender ? user.gender.toLowerCase() : null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return {
    id: insertedUser.id,
    name: insertedUser.name,
    email: insertedUser.email,
  };
}

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

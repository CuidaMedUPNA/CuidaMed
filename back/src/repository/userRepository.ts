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

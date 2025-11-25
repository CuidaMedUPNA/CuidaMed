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

export async function getUserById(id: number) {
  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  return user;
}
export async function saveDeviceToken(
  userId: number,
  firebaseToken: string,
  platform: "android" | "ios" | "web",
  deviceId: string
): Promise<boolean> {
  try {
    const existingDevice = await db
      .selectFrom("user_device")
      .where("user_id", "=", userId)
      .where("platform", "=", platform)
      .where("device_id", "=", deviceId)
      .selectAll()
      .executeTakeFirst();

    if (existingDevice) {
      // Solo actualizar si el token es diferente
      if (existingDevice.firebase_token !== firebaseToken) {
        await db
          .updateTable("user_device")
          .set({
            firebase_token: firebaseToken,
            updated_at: new Date().toISOString(),
          })
          .where("user_id", "=", userId)
          .where("platform", "=", platform)
          .where("device_id", "=", deviceId)
          .execute();
        console.log(
          `✅ Token de Firebase actualizado para ${platform} (${deviceId})`
        );
      }
      return true;
    }

    await db
      .insertInto("user_device")
      .values({
        user_id: userId,
        firebase_token: firebaseToken,
        platform,
        device_id: deviceId,
      })
      .execute();
    console.log(`✨ Nuevo device registrado: ${platform} (${deviceId})`);
    return true;
  } catch (error) {
    console.error("Error guardando token de Firebase:", error);
    return false;
  }
}

import admin from "firebase-admin";

export interface FirebaseNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

let firebaseInitialized = false;

function getServiceAccount(): admin.ServiceAccount {
  if (!process.env.FIREBASE_CREDENTIALS) {
    throw new Error(
      "FIREBASE_CREDENTIALS environment variable is not set. Please set it with the Firebase service account JSON."
    );
  }

  try {
    const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    console.log("📂 Credenciales cargadas desde FIREBASE_CREDENTIALS env");
    return credentials;
  } catch (error) {
    throw new Error(
      `Error parseando FIREBASE_CREDENTIALS: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export function initializeFirebase() {
  try {
    const serviceAccount = getServiceAccount();

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    console.log("✅ Firebase inicializado correctamente");
  } catch (error) {
    console.error("❌ Error inicializando Firebase:", error);
    throw error;
  }
}

export async function sendFirebaseNotification(
  firebaseToken: string,
  payload: FirebaseNotificationPayload
): Promise<boolean> {
  try {
    if (!firebaseInitialized) {
      throw new Error("Firebase no inicializado");
    }

    const message = {
      token: firebaseToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      ...(payload.data && { data: payload.data }),
    };

    const response = await admin.messaging().send(message);
    console.log(
      `📨 Notificación enviada a ${firebaseToken.slice(
        0,
        20
      )}... - Response: ${response}`
    );
    console.log(`   Título: ${payload.title}`);
    console.log(`   Cuerpo: ${payload.body}`);

    return true;
  } catch (error) {
    console.error("❌ Error enviando notificación:", error);
    throw error;
  }
}

export async function sendMultipleNotifications(
  firebaseTokens: string[],
  payload: FirebaseNotificationPayload
): Promise<number> {
  try {
    if (!firebaseInitialized) {
      throw new Error("Firebase no inicializado");
    }

    if (firebaseTokens.length === 0) {
      console.log("ℹ️ No hay tokens para enviar notificaciones");
      return 0;
    }

    console.log(
      `📨 Enviando notificación a ${firebaseTokens.length} dispositivo(s)...`
    );

    const messages = firebaseTokens.map((token) => ({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      ...(payload.data && { data: payload.data }),
    }));

    const response = await admin.messaging().sendAll(messages);

    console.log(
      `✅ Notificaciones enviadas: ${response.successCount}/${firebaseTokens.length}`
    );

    if (response.failureCount > 0) {
      console.warn(`⚠️ Fallos en envío: ${response.failureCount}`);
      response.responses.forEach((resp, index) => {
        if (!resp.success) {
          console.warn(`   Token ${index}: ${resp.error?.message}`);
        }
      });
    }

    return response.successCount;
  } catch (error) {
    console.error("❌ Error enviando notificaciones:", error);
    throw error;
  }
}

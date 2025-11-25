import {
  getScheduledIntakesForNow,
  getUserDevices,
} from "./treatmentRepository";
import { sendFirebaseNotification } from "../services/firebase";

interface Intake {
  medicineName: string;
  doseAmount: number;
  doseUnit: string;
}

interface NotificationMessage {
  title: string;
  body: string;
}

function buildNotificationMessage(intakes: Intake[]): NotificationMessage {
  const medicineList = intakes
    .map(
      (intake) =>
        `${intake.medicineName} (${intake.doseAmount} ${intake.doseUnit})`
    )
    .join(", ");

  const isSingular = intakes.length === 1;
  const title = `Recuerda tomar tu${isSingular ? "" : "s"} medicamento${
    isSingular ? "" : "s"
  }`;
  const body = medicineList;

  return { title, body };
}

export async function notifyScheduledIntakes() {
  try {
    console.log("🔔 Iniciando proceso de notificaciones programadas...");

    const intakesByUser = await getScheduledIntakesForNow();

    if (intakesByUser.size === 0) {
      console.log("ℹ️ No hay tomas programadas para este minuto");
      return;
    }

    console.log(`📋 Encontradas tomas para ${intakesByUser.size} usuario(s)`);

    // Para cada usuario
    for (const [userId, intakes] of intakesByUser.entries()) {
      try {
        // Obtener devices del usuario
        const devices = await getUserDevices(userId);

        if (devices.length === 0) {
          console.log(`⚠️ Usuario ${userId} sin devices registrados`);
          continue;
        }

        // Construir mensaje
        const message = buildNotificationMessage(intakes);

        // Enviar a cada device
        let successCount = 0;
        for (const device of devices) {
          const sent = await sendFirebaseNotification(device.firebase_token, {
            title: message.title,
            body: message.body,
            data: {
              userId: userId.toString(),
              intakesCount: intakes.length.toString(),
            },
          });
          if (sent) {
            successCount++;
          }
        }

        console.log(
          `✅ Usuario ${userId}: notificación enviada a ${successCount}/${devices.length} devices`
        );
      } catch (error) {
        console.error(`❌ Error procesando usuario ${userId}:`, error);
      }
    }

    console.log("✨ Proceso de notificaciones completado");
  } catch (error) {
    console.error("❌ Error en notifyScheduledIntakes:", error);
  }
}

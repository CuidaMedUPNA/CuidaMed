import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Application from "expo-application";
import { Platform } from "react-native";
import { storageHelper } from "./storage";

// Storage keys
const DEVICE_ID_KEY = "deviceId";
const FCM_TOKEN_KEY = "fcmToken";

/**
 * Get or create a unique device ID that persists forever on the device.
 * - On Android: Uses Android ID (persists across app reinstalls)
 * - On iOS: Uses ID for Vendor (persists until all apps from vendor are uninstalled)
 * - On Web: Generates and stores a UUID
 *
 * The ID is stored in SecureStore/localStorage for consistency across sessions.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  try {
    // First, check if we already have a stored device ID
    const storedDeviceId = await storageHelper.getItem(DEVICE_ID_KEY);
    if (storedDeviceId) {
      console.log("Using stored device ID:", storedDeviceId);
      return storedDeviceId;
    }

    let deviceId: string;

    if (Platform.OS === "android") {
      // Android ID persists across app reinstalls on the same device
      deviceId = Application.getAndroidId() ?? generateUUID();
    } else if (Platform.OS === "ios") {
      // iOS: ID for Vendor - persists until all vendor apps are uninstalled
      deviceId = (await Application.getIosIdForVendorAsync()) ?? generateUUID();
    } else {
      // Web: Generate a UUID
      deviceId = generateUUID();
    }

    // Store permanently for future use
    await storageHelper.setItem(DEVICE_ID_KEY, deviceId);
    console.log("Generated and stored new device ID:", deviceId);

    return deviceId;
  } catch (error) {
    console.error("Error getting device ID:", error);
    // Fallback: generate a UUID
    const fallbackId = generateUUID();
    try {
      await storageHelper.setItem(DEVICE_ID_KEY, fallbackId);
    } catch {
      // Ignore storage errors for fallback
    }
    return fallbackId;
  }
}

/**
 * Get the FCM push token for this device.
 * Requests notification permissions if not already granted.
 * Stores the token for persistence.
 *
 * @returns The FCM token or empty string if unavailable
 */
export async function getFirebasePushToken(): Promise<string> {
  try {
    // On web, push notifications work differently
    if (Platform.OS === "web") {
      console.log(
        "Web push notifications not implemented, returning empty token"
      );
      return "";
    }

    // Push notifications only work on physical devices
    if (!Device.isDevice) {
      console.log(
        "Push notifications require a physical device (not simulator/emulator)"
      );
      // Return stored token if available (for development)
      const storedToken = await storageHelper.getItem(FCM_TOKEN_KEY);
      return storedToken ?? "";
    }

    // Check current permission status
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not already granted
    if (existingStatus !== "granted") {
      console.log("Requesting push notification permissions...");
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return "";
    }

    // Get the native FCM/APNs token (not Expo push token)
    // This is what Firebase Admin SDK on the backend expects
    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    const token = tokenResponse.data;

    console.log("Got FCM push token:", token.substring(0, 20) + "...");

    // Store for persistence
    await storageHelper.setItem(FCM_TOKEN_KEY, token);

    return token;
  } catch (error) {
    console.error("Error getting Firebase push token:", error);
    // Try to return stored token as fallback
    const storedToken = await storageHelper.getItem(FCM_TOKEN_KEY);
    return storedToken ?? "";
  }
}

/**
 * Get the current platform as expected by the API
 */
export function getPlatform(): "android" | "ios" | "web" {
  return Platform.OS as "android" | "ios" | "web";
}

/**
 * Get all push notification credentials needed for login/register
 */
export async function getPushCredentials(): Promise<{
  firebaseToken: string;
  deviceId: string;
  platform: "android" | "ios" | "web";
}> {
  const [firebaseToken, deviceId] = await Promise.all([
    getFirebasePushToken(),
    getOrCreateDeviceId(),
  ]);

  return {
    firebaseToken,
    deviceId,
    platform: getPlatform(),
  };
}

/**
 * Set up notification handler configuration
 * Call this early in app initialization
 */
export function configurePushNotifications(): void {
  // Configure how notifications are handled when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Listen for FCM token refresh events
 * The callback will be called when Firebase issues a new token
 */
export function onTokenRefresh(callback: (token: string) => void): () => void {
  const subscription = Notifications.addPushTokenListener(
    async (tokenEvent) => {
      const newToken = tokenEvent.data;
      console.log("FCM token refreshed:", newToken.substring(0, 20) + "...");

      // Store the new token
      await storageHelper.setItem(FCM_TOKEN_KEY, newToken);

      callback(newToken);
    }
  );

  return () => subscription.remove();
}

// Helper function to generate UUID
function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers/React Native)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback UUID v4 generation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

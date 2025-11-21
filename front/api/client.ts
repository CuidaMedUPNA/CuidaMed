import { client } from "@cuidamed-api/client";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config";

// Configure base URL
client.setConfig({
  baseUrl: API_URL,
});

// Storage helper - same as in AuthContext
const storageHelper = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },
};

// Request interceptor ID for potential removal/management
let requestInterceptorId: number | undefined;
let errorInterceptorId: number | undefined;

/**
 * Register the request interceptor that automatically injects the Bearer token
 * into all API requests.
 * Call this once when the app initializes (in AuthProvider).
 */
export function registerAuthInterceptor() {
  // Only register once
  if (requestInterceptorId !== undefined) {
    return;
  }

  requestInterceptorId = client.interceptors.request.use(
    async (request: Request) => {
      try {
        const token = await storageHelper.getItem("authToken");
        if (token) {
          // Add Bearer token to Authorization header
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error adding auth token to request:", error);
      }
      return request;
    }
  );
}

/**
 * Register error interceptor to handle 401 responses (expired/invalid token)
 * Removes stored token and triggers logout
 */
export function registerErrorInterceptor(onUnauthorized: () => void) {
  // Only register once
  if (errorInterceptorId !== undefined) {
    return;
  }

  errorInterceptorId = client.interceptors.error.use(
    async (error: unknown, response: Response) => {
      // Check if it's a 401 Unauthorized response
      if (response && response.status === 401) {
        console.warn("Unauthorized (401) - Token may be expired");
        // Clear stored credentials
        try {
          if (Platform.OS === "web") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userEmail");
          } else {
            await SecureStore.deleteItemAsync("authToken");
            await SecureStore.deleteItemAsync("userEmail");
          }
        } catch (e) {
          console.error("Error clearing auth on 401:", e);
        }
        // Trigger logout callback
        onUnauthorized();
      }
      return error;
    }
  );
}

export { client };

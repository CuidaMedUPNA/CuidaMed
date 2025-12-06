import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Storage helper functions that work on both web and mobile.
 * - Web: Uses localStorage
 * - Mobile: Uses SecureStore (encrypted storage)
 */
export const storageHelper = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  },

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

  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },
};

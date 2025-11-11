import * as React from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  isLogged: boolean;
  isLoading: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Storage helper functions that work on both web and mobile
const storageHelper = {
  setItem: async (key: string, value: string) => {
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

  removeItem: async (key: string) => {
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkStoredLogin();
  }, []);

  const checkStoredLogin = async () => {
    try {
      const token = await storageHelper.getItem("authToken");
      const email = await storageHelper.getItem("userEmail");
      if (token) {
        setIsLogged(true);
        setUserEmail(email);
      }
    } catch (error) {
      console.error("Error checking stored login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual API login call
      // For now, we'll just store a dummy token
      const token = `token_${email}`;
      await storageHelper.setItem("authToken", token);
      await storageHelper.setItem("userEmail", email);
      setIsLogged(true);
      setUserEmail(email);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storageHelper.removeItem("authToken");
      await storageHelper.removeItem("userEmail");
      setIsLogged(false);
      setUserEmail(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLogged, isLoading, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

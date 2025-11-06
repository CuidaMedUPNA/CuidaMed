import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  isLogged: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStoredLogin();
  }, []);

  const checkStoredLogin = async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        setIsLogged(true);
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
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("userEmail", email);
      setIsLogged(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authToken");
      await SecureStore.deleteItemAsync("userEmail");
      setIsLogged(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLogged, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

import Constants from "expo-constants";
import { Platform } from "react-native";

// Obtener la IP local del servidor de desarrollo para conectarse al backend
const getApiUrl = () => {
  const manifest = Constants.expoConfig;
  const debuggerHost = manifest?.hostUri?.split(":").shift();

  // Si es un túnel de Expo (.exp.direct), no usar esa URL
  if (debuggerHost && !debuggerHost.includes("exp.direct")) {
    return `http://${debuggerHost}:3000`;
  }

  // Fallback para web o producción
  return "https://cuidamed-1e81b121bd5d.herokuapp.com";
};

export const API_URL = getApiUrl();

console.log("API URL:", API_URL);
console.log("Platform:", Platform.OS);

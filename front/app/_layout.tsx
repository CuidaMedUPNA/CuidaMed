import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/api/client";
import { useEffect, useState } from "react";
import { CustomSplashScreen } from "@/components/CustomSplashScreen";
import * as SplashScreen from "expo-splash-screen";
import { useTranslation } from "react-i18next";

// Mantener la splash screen nativa visible mientras cargamos
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLogged, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const { t } = useTranslation();

  const [appIsReady, setAppIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando...");

  // Simular carga de recursos con progreso
  useEffect(() => {
    async function prepare() {
      try {
        // Ocultar splash nativa y mostrar la nuestra
        await SplashScreen.hideAsync();

        // Fase 1: Inicialización (0% - 30%)
        setLoadingMessage(
          t("splash.initializing", { defaultValue: "Iniciando aplicación..." })
        );
        setProgress(0.1);
        await delay(300);
        setProgress(0.2);
        await delay(200);
        setProgress(0.3);

        // Fase 2: Cargando recursos (30% - 60%)
        setLoadingMessage(
          t("splash.loading_resources", {
            defaultValue: "Cargando recursos...",
          })
        );
        await delay(300);
        setProgress(0.4);
        await delay(200);
        setProgress(0.5);
        await delay(200);
        setProgress(0.6);

        // Fase 3: Verificando sesión (60% - 80%)
        setLoadingMessage(
          t("splash.checking_session", {
            defaultValue: "Verificando sesión...",
          })
        );
        await delay(300);
        setProgress(0.7);
        await delay(200);
        setProgress(0.8);

        // Fase 4: Preparando interfaz (80% - 100%)
        setLoadingMessage(
          t("splash.preparing_interface", {
            defaultValue: "Preparando interfaz...",
          })
        );
        await delay(300);
        setProgress(0.9);
        await delay(200);
        setProgress(1);

        // Pequeña pausa antes de mostrar la app
        await delay(400);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [t]);

  // Navegación basada en autenticación
  useEffect(() => {
    if (!appIsReady || authLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (isLogged && !inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isLogged && inAuthGroup) {
      router.replace("/login");
    }
  }, [isLogged, authLoading, appIsReady, router, segments]);

  // Mostrar splash personalizada mientras carga
  if (!appIsReady || authLoading) {
    return <CustomSplashScreen progress={progress} message={loadingMessage} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

// Función auxiliar para delays
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/api/client";
import { useEffect } from "react";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (isLogged && !inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isLogged && inAuthGroup) {
      router.replace("/login");
    }
  }, [isLogged, isLoading, router, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F23728" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
    </Stack>
  );
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

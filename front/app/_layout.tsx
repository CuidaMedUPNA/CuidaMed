import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { client } from "@cuidamed-api/client";
import { API_URL } from "@/config";
import { useSafeAreaInsets } from "react-native-safe-area-context";

client.setConfig({
  baseUrl: API_URL,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#F23728",
          tabBarInactiveTintColor: "#6b6b6bff",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarLabel: `${t("tabs.home")}`,
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="treatments"
          options={{
            tabBarLabel: `${t("tabs.treatments")}`,
            headerShown: false,
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="medication" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: `${t("tabs.profile")}`,
            headerShown: false,
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="maps/index"
          options={{
            tabBarLabel: `${t("tabs.maps")}`,
            headerShown: false,
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="map" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}

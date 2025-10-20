import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { client } from "@cuidamed-api/client";
import { API_URL } from "@/config";

client.setConfig({
  baseUrl: API_URL,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{ tabBarLabel: `${t("landingPageTitle")}` }}
        />
        <Tabs.Screen
          name="treatments"
          options={{
            tabBarLabel: `${t("treatments.treatmentsTitle")}`,
            headerShown: false,
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="medication" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}

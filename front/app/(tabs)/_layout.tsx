import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "@/api/client";
import CustomNavBar from "@/components/CustomNavBar";

const queryClient = new QueryClient();

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs tabBar={(props) => <CustomNavBar {...props} />}>
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
          name="maps"
          options={{
            tabBarLabel: t("tabs.maps"),
            headerShown: false,
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="location-on" size={size} color={color} />
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
          name="calendar"
          options={{
            tabBarLabel: `${t("tabs.calendar")}`,
            headerShown: false,
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="calendar-month" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}

import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const { t } = useTranslation();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{ tabBarLabel: `${t("landingPageTitle")}` }}
        />
        <Tabs.Screen
          name="tratamientos/MisTratamientos"
          options={{
            tabBarLabel: `${t("treatmentsTitle")}`,
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

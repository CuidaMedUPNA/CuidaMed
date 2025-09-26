import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ tabBarLabel: "Pantalla principal" }}
      />
      <Tabs.Screen
        name="pastillas/Pastillas"
        options={{
          tabBarLabel: "Pastillas",
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialIcons name="medication" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

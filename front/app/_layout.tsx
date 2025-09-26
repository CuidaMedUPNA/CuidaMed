import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ tabBarLabel: "Pantalla principal" }}
      />
      <Tabs.Screen
        name="home/index"
        options={{ tabBarLabel: "Pantalla secundaria" }}
      />
    </Tabs>
  );
}

import { Tabs } from "expo-router";
import React from "react";

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

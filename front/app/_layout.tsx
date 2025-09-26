import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: "Pantalla principal",
                    headerShown: false,
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="login/index"
                options={{ tabBarLabel: "Login", headerShown: false,
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <MaterialIcons name="login" size={size} color={color} />
                    ),
                 }}
            />
            <Tabs.Screen
                name="perfil/index"
                options={{ 
                    tabBarLabel: "Perfil", 
                    headerShown: false,
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                 }}
            />
            <Tabs.Screen
                name="pastillas/index"
                options={{
                    tabBarLabel: "Pastillas",
                    headerShown: false,
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <MaterialIcons name="medication" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendario/index"
                options={{
                    tabBarLabel: "Calendario",
                    headerShown: false,
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
                        <MaterialIcons name="calendar-today" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

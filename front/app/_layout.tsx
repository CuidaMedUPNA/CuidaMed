import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import "@/i18n";
import { useTranslation } from "react-i18next";

export default function RootLayout() {
    const { t } = useTranslation();
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{ tabBarLabel: `${t('landingPageTitle')}` }}
            />
            <Tabs.Screen
                name="tratamientos/MisTratamientos"
                options={{
                    tabBarLabel: `${t('treatmentsTitle')}`,
                    headerShown: false,
                    tabBarIcon: ({
                        color,
                        size,
                    }: {
                        color: string;
                        size: number;
                    }) => (
                        <MaterialIcons
                            name="medication"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TreatmentsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        contentStyle: { paddingTop: insets.top, paddingBottom: insets.bottom },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[treatmentId]"
        options={{
          headerShown: false,
          title: "Detalle del Tratamiento",
        }}
      />
      <Stack.Screen
        name="[treatmentId]/addMedicine"
        options={{
          headerShown: false,
          title: "Agregar Medicamento",
        }}
      />
    </Stack>
  );
}

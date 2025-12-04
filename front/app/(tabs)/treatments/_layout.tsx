import { Stack } from "expo-router";

export default function TreatmentsLayout() {
  return (
    <Stack>
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

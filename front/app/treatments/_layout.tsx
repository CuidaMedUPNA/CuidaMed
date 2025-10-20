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
        name="[treatmentName]"
        options={{
          headerShown: true,
          title: "Detalle del Tratamiento",
        }}
      />
    </Stack>
  );
}

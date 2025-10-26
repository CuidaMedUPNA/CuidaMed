import { MyTreatmentsPage } from "@/pages/MyTreatmentsPage";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function MisTratamientos() {
  return (
    <SafeAreaProvider>
      <MyTreatmentsPage />
    </SafeAreaProvider>
  );
}

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AddMedicinePage } from "@/pages/AddMedicine/AddMedicinePage";
import { useLocalSearchParams } from "expo-router";

export default function AddMedicine() {
  const { treatmentId: treatmentIdStr } = useLocalSearchParams();
  const treatmentId = treatmentIdStr
    ? parseInt(treatmentIdStr as string, 10)
    : undefined;
  return (
    <SafeAreaProvider>
      <AddMedicinePage />
    </SafeAreaProvider>
  );
}

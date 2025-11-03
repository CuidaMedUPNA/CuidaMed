import { SafeAreaProvider } from "react-native-safe-area-context";
import { AddMedicinePage } from "@/pages/AddMedicine/AddMedicinePage";

export default function AddMedicine() {
  return (
    <SafeAreaProvider>
      <AddMedicinePage />
    </SafeAreaProvider>
  );
}

import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TreatmentDetailPage } from "@/pages/TreatmentDetail/TreatmentDetailPage";

export default function TreatmentDetail() {
  const { treatmentName } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <TreatmentDetailPage treatmentName={treatmentName as string} />
    </SafeAreaProvider>
  );
}

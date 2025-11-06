import { useLocalSearchParams } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TreatmentDetailPage } from "@/pages/TreatmentDetail/TreatmentDetailPage";

export default function TreatmentDetail() {
  const { treatmentId: treatmentIdStr } = useLocalSearchParams();
  const treatmentId = treatmentIdStr
    ? parseInt(treatmentIdStr as string, 10)
    : undefined;

  return (
    <SafeAreaProvider>
      <TreatmentDetailPage treatmentId={treatmentId as number} />
    </SafeAreaProvider>
  );
}
